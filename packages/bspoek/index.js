const Photon = require('@generated/photon')
const { nexusPrismaPlugin } = require('@generated/nexus-prisma')
const { makeSchema, objectType, idArg, stringArg } = require('@prisma/nexus')
const { GraphQLServer } = require('graphql-yoga')
const { join } = require('path')
const forEach = require('lodash/fp/forEach');
const map = require('lodash/fp/map');

//
const photon = new Photon()
const { queryType, mutationType, modelMap } = photon.dmmf; // model introspection

const nexusPrisma = nexusPrismaPlugin({
  photon: (ctx) => ctx.photon,
})

//
const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.findOneUser();
    forEach((f) => {
      if (typeof t.crud[f.name] === 'function') {
        // additional filters and abstraction here
        t.crud[f.name]();
      }
    }, queryType.fields);
  },
})

//
const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    forEach((f) => {
      if (typeof t.crud[f.name] === 'function') {
        // additional filters and abstraction here
        t.crud[f.name]();
      }
    }, mutationType.fields);
  },
});

//
const types = map(({ name, fields }) => objectType({
  name,
  definition(t) {
    forEach(f => {
      // additional filters and abstraction here
      t.model[f.name]();
    }, fields);
  }
}), modelMap);

//
const BatchPayload = objectType({
  name: "BatchPayload",
  definition(t) {
    t.field("count", { type: "Int", })
  },
});

//
const schema = makeSchema({
  types: [Query, Mutation, ...types, BatchPayload, nexusPrisma],
  outputs: {
    schema: join(__dirname, '/generated/schema.graphql'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@generated/photon',
        alias: 'photon',
      },
    ],
  },
})

const server = new GraphQLServer({
  schema,
  context: request => {
    return {
      ...request,
      photon,
    }
  },
})

server.start(() => console.log(`🚀 Server ready at http://localhost:4000`))
