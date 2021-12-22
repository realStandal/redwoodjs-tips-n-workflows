import type { Prisma } from '@prisma/client'

import { relationMiddleware } from './relation'
import type { RelationOptions } from './relation'

const getOpts = (): RelationOptions => ({
  idField: 'organizationId',
  idGetter: () => context.currentUser.organizationId,
  models: ['Pallet', 'Product'],
  relationModel: 'Organization',
})
const getParams = (): Prisma.MiddlewareParams => ({
  action: 'create',
  args: {
    data: { name: 'Test' },
    where: { id: '1' },
  },
  dataPath: [''],
  runInTransaction: false,
  model: 'Pallet',
})

describe('relation utilities', () => {
  describe('relationMiddleware', () => {
    // Re-usable variables, re-initalized before each test
    let CB: Prisma.Middleware
    let Params: Prisma.MiddlewareParams
    let Next: <T>(params: Prisma.MiddlewareParams) => Promise<T>
    let Options: RelationOptions
    const organizationId = '1'

    beforeEach(() => {
      /// @ts-expect-error testing custom functionality
      mockCurrentUser({ organizationId })

      Params = getParams()
      Options = getOpts()
      Next = jest.fn()
      CB = relationMiddleware(Options)
    })

    it('returns a function with two arguments', () => {
      expect(typeof CB === 'function').toBeTruthy()
      expect(CB.length === 2).toBeTruthy()
    })

    it('calls `next` only once', async () => {
      await CB(Params, Next)
      expect(Next).toHaveBeenCalledTimes(1)
    })

    it('returns the results of calling `next` with updated `params`', async () => {})

    it('does not run for unconfigured models', async () => {
      const params: Prisma.MiddlewareParams = { ...Params, model: 'User' }
      await CB(params, Next)
      expect(Next).toHaveBeenCalledWith(params)
      expect(Next).not.toHaveBeenCalledWith({
        ...params,
        args: { data: { ...params.args.data, organizationId } },
      })
    })

    it('adds `idField` to `params.args`', async () => {
      await CB(Params, Next)
      expect(Params.args.data.organizationId).toBe(organizationId)
    })

    it('adds `idField` to `params.args` in the correct location', async () => {
      await CB(Params, Next)
      expect(Params.args.data.organizationId).toBe(organizationId)
      expect(Params.args.where.organizationId).toBeUndefined()

      Params = getParams()
      const params: Prisma.MiddlewareParams = { ...Params, action: 'findFirst' }
      await CB(params, Next)
      expect(params.args.data.organizationId).toBeUndefined()
      expect(params.args.where.organizationId).toBe(organizationId)
    })

    it('supports a custom `idField` option', async () => {
      /// @ts-expect-error testing custom functionality
      mockCurrentUser({ orange: '2' })
      const idField = 'orange'
      // @ts-expect-error testing custom functionality
      const idGetter = () => context.currentUser.orange
      const cb = relationMiddleware({ ...Options, idField, idGetter })
      await cb(Params, Next)
      expect(Params.args.data.orange).toBe('2')
      expect(Params.args.data.organizationId).toBeUndefined()
    })

    it('supports a custom `idGetter` option', async () => {
      const idGetter = jest.fn(() => '3')
      const cb = relationMiddleware({ ...Options, idGetter })
      await cb(Params, Next)
      expect(idGetter).toHaveBeenCalledTimes(1)
      expect(idGetter).toHaveBeenCalledWith()
      expect(Params.args.data.organizationId).toBe('3')
      expect(Params.args.data.organizationId).not.toBe(organizationId)
    })

    it('supports a custom `relationModel` option', async () => {
      const cb = relationMiddleware({
        ...Options,
        models: [...Options.models, 'Organization'],
        relationModel: 'Pallet',
      })
      const params: Prisma.MiddlewareParams = {
        ...Params,
        model: 'Organization',
      }
      await cb(params, Next)
      expect(params.args.data.organizationId).toBe(organizationId)
    })

    it('does not run for `relationModel`', async () => {
      const cb = relationMiddleware({ ...Options, relationModel: 'Pallet' })
      await cb(Params, Next)
      expect(Params.args.data.organizationId).toBeUndefined()
      expect(Next).toHaveBeenCalledWith(Params)
    })

    it('removes `idField` from update queries', async () => {
      const params: Prisma.MiddlewareParams = {
        ...Params,
        args: { data: { ...Params.args.data, organizationId } },
        action: 'update',
      }
      await CB(params, Next)
      expect(params.args.data.organizationId).toBeUndefined()
      expect(params.args.data.organizationId).not.toBe(organizationId)
    })

    it('can be configured to support updating `idField`', async () => {
      const cb = relationMiddleware({ ...Options, disableUpdates: false })
      const params: Prisma.MiddlewareParams = {
        ...Params,
        args: { data: { ...Params.args.data, organizationId: 5 } },
        action: 'update',
      }
      await cb(params, Next)
      expect(params.args.data.organizationId).not.toBeUndefined()
      expect(params.args.data.organizationId).toBe(5)
    })

    it('does not trigger when `idField` is defined', async () => {
      let params: Prisma.MiddlewareParams = {
        ...Params,
        args: { data: { organizationId: '4' } },
      }
      await CB(params, Next)
      expect(params.args.data.organizationId).toBe('4')

      // `null` is a value distinct from `undefined`
      params = {
        ...Params,
        args: { data: { organizationId: null } },
      }
      await CB(params, Next)
      expect(params.args.data.organizationId).toBeNull()

      // `undefined` should get the value returned by `idGetter`
      params = {
        ...Params,
        args: { data: { organizationId: undefined } },
      }
      await CB(params, Next)
      expect(params.args.data.organizationId).toBe(organizationId)
    })

    // "manually drawn" = using `organization: { connect/create: ... }`
    it('does not trigger when the relation is manually drawn', async () => {
      const params: Prisma.MiddlewareParams = {
        ...Params,
        args: { data: { organization: {} } },
      }
      await CB(params, Next)
      expect(params.args.data.organizationId).toBeUndefined()
      expect(params.args.data.organization).toEqual(expect.objectContaining({}))
    })

    it('adds `params.args` if it is undefined', async () => {
      const params: Prisma.MiddlewareParams = { ...Params, args: undefined }
      await CB(params, Next)
      expect(params.args).not.toBeUndefined()
    })

    it('adds `params.args.{data|where}` if it is undefined', async () => {
      const params: Prisma.MiddlewareParams = {
        ...Params,
        args: { data: undefined },
      }
      await CB(params, Next)
      expect(params.args.data).not.toBeUndefined()
    })
  })
})
