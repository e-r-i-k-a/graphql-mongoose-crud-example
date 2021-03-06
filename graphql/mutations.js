const graphql = require('graphql');
const PageModel = require('../models/page');

const { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

const PageType = require('./types');

// Mutations to Create a Page, or Delete / Update an Existing page by ID
// Can Create a new Page without links but all other fields are required!!!
const mutation = new GraphQLObjectType({
  name:'Mutation',
  fields: {
    addPage: {
      type: PageType,
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: GraphQLString},
        route: {type: new GraphQLNonNull(GraphQLString)},
        links:{type: GraphQLList(GraphQLString)}
      },
      resolve(parentValue, {title, content, route}){
        const instance = new PageModel({ title: title, content:content, route:route});
        return instance.save();
      }
    },
    // Delete by ID
    deletePage: {
      type: PageType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}){
        return PageModel.findByIdAndRemove(id);
      }
    },
    // Update by ID
    updatePage: {
      type: PageType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        route: {type: GraphQLString},
        links:{type: GraphQLList(GraphQLString)}
      },
      resolve(parentValue, args){
        return PageModel.findByIdAndUpdate(args.id, args, {new:true});
      }
    }
  }
});

module.exports = mutation;
