/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (GGRC, can) {
  'use strict';

  GGRC.ListLoaders.TreeBaseLoader('GGRC.ListLoaders.SubTreeLoader', {}, {
    load: function (params, models) {
      return GGRC.Utils.QueryAPI.makeRequest(params)
        .then(function (response) {
          var mapped = [];
          models.forEach(function (modelName, idx) {
            var values = can.makeArray(response[idx][modelName].values);
            var models = values.map(function (source) {
              return CMS.Models[modelName].model(source);
            });
            mapped = mapped.concat(models);
          });
          return mapped;
        })
        .then(function (list) {
          var directlyRelated = [];
          var notRelated = [];
          var result = [];
          var pageUtils = GGRC.Utils.CurrentPage;
          var related = pageUtils.related;
          var needToSplit = pageUtils.isObjectContextPage();

          if (needToSplit) {
            list.forEach(function (inst) {
              var relates = related.attr(inst.type);
              if (relates && relates[inst.id]) {
                directlyRelated.push(inst);
              } else {
                notRelated.push(inst);
              }
            });
            result = directlyRelated.concat(notRelated);
          } else {
            result = list;
          }
          return this.insertInstancesFromMappings(result);
        }.bind(this));
    }
  });
})(GGRC, can);
