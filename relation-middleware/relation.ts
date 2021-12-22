import type { Prisma } from '@prisma/client'

type PrismaAction = Prisma.PrismaAction
type ModelName = Prisma.ModelName

type MiddlewareParams = Prisma.MiddlewareParams
type MiddlewareNext = <T>(params: MiddlewareParams) => Promise<T>

// ==

/**
 * The possible locations on `params.args` where a relation's unique identifier will be added.
 */
export type RelationQueryArg = 'data' | 'where'

/**
 * A `RelationActionMap` maps a `PrismaAction` to its `RelationQueryArg`
 */
export type RelationActionMap = Partial<{
  [key in PrismaAction]: RelationQueryArg
}>

/**
 * Options to configure the relationship middleware callback.
 */
export interface RelationOptions {
  /**
   * This option can be used to disable updating a created model's `idField`, once it has been created.
   *
   * Setting this option to `false` will allow you to overwrite the value given by the middleware during creation.
   *
   * **Note:** This option **does not** reject the entire query, only the portion which would update the tenant which "owns" the instance of a model.
   *
   * **Note:** [`upsert`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert) actions are still allowed,
   * to not loose the "or create" functionality of the action.
   *
   * @default true
   */
  disableUpdates?: boolean
  /**
   * Your application's models which this middleware should be enabled for.
   *
   * These models should have corresponding fields dedicated to storing their
   * relationship to an organization. See `idField` for more.
   *
   * These models should have an n-1 relationship with the configured relation-model.
   *
   * @default []
   */
  models: ModelName[]
  /**
   * A field on each of your middleware-enabled models used to identify the instance of a model it relates to.
   */
  idField: string
  /**
   * An (optionally) asynchronous function, used as the `idField` getter.
   *
   * This function should return a string, which is used as the value for `idField`.
   */
  idGetter: () => string | Promise<string>
  /**
   * The model (created by you) which will form a relationship with all enabled models.
   *
   * The relation-model should have a 1-n relationship with enabled-models.
   *
   * Note: If it does not already exist, you will need to create the default model and draw relations
   * between all of your existing models.
   */
  relationModel: ModelName
}

// ===

/**
 * Default `PrismaActions` which are supported by the multitenancy middleware.
 *
 * If a key is *not* present, that is inferred as it not being supported.
 * The multitenancy middleware does **not** take effect on actions which it does not support.
 *
 * **Note:** This object maybe useful if you plan to add additional actions, and just want to spread the defaults.
 */
export const RelationActionMap: RelationActionMap = {
  aggregate: 'where',
  count: 'where',
  create: 'data',
  createMany: 'data',
  deleteMany: 'where',
  findFirst: 'where',
  findMany: 'where',
  upsert: 'data',
}

/**
 * `PrismaActions` considered "updative" - they cause a transformation to existing records.
 */
const RelationUpdateActions: PrismaAction[] = ['update', 'updateMany']

// ===

/**
 * Configurable [Prisma Middleware](https://www.prisma.io/docs/concepts/components/prisma-client/middleware)
 * for automating the process of defining 1-n relationships between a model and many enabled-models.
 */
export const relationMiddleware = <T>({
  disableUpdates = true,
  models = [],
  idField = undefined,
  idGetter = undefined,
  relationModel = undefined,
}: RelationOptions) => {
  const relationField =
    relationModel.charAt(0).toLowerCase() + relationModel.slice(1)
  return async (params: MiddlewareParams, next: MiddlewareNext) => {
    if (
      params.model !== relationModel &&
      models.includes(params.model) &&
      Object.keys(RelationActionMap).includes(params.action)
    ) {
      const arg = RelationActionMap[params.action]

      if (typeof params.args === 'undefined') {
        params.args = {}
      }

      if (typeof params.args[arg] === 'undefined') {
        params.args[arg] = {}
      }

      const oldId = params.args[arg][idField]
      const oldRelation = params.args[arg][relationField]

      if (typeof oldId === 'undefined' && typeof oldRelation === 'undefined') {
        params.args[arg][idField] = await idGetter()
      }
    }

    // Flow is nested in different levels to:
    //  A) Emphasize the derterministic behavior of this logic (if: X==true then: Y==true then: Z..).
    //  B) Allow heavy opinionations on the method used to determine if a field is present, and should therefore be removed.
    if (disableUpdates) {
      if (
        RelationUpdateActions.includes(params.action) &&
        typeof params.args.data === 'object'
      ) {
        const oldId = params.args.data[idField]
        const oldRelation = params.args.data[relationField]
        if (
          typeof oldId !== 'undefined' ||
          typeof oldRelation !== 'undefined'
        ) {
          delete params.args.data[idField]
          delete params.args.data[relationField]
        }
      }
    }

    return next<T>(params)
  }
}
