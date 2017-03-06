const sdk = require('kinvey-flex-sdk');
var Promise = require("bluebird");
const async = require('async');
const request = require('request'); // assumes that the request module was added to package.json

sdk.service(function(err, flex) {
    const flexFunctions = flex.functions; // gets the FlexFunctions object from the service

    function writeOrderData(context, complete, modules) {

        const dataStore = modules.dataStore();
        const detailCollection = dataStore.collection('orderdetail');

        var entity = context.body;

        var details = context.body.OrderDetails;
        delete entity.OrderDetails;

        console.log(details);

        const collection = dataStore.collection('orderheader');

        console.log('saving/updating orderheader');

        function saveme(entity, doneCallback) {
            detailCollection.save(entity, (err, savedResult) => {

                if (err) {
                    console.log('******ERROR*****');
                    console.log(err);
                    return doneCallback(err);
                } else {
                    return doneCallback();
                }
            });

        };


        collection.save(entity, (err, result) => {
            if (err) {
                return complete().setBody(err).runtimeError().done();
            }

            // now we need to save/update the orderdetails
            //
            async.eachLimit(details, 5, saveme, (derr) => {

                if (err) {
                    console.log('error writing');
                    console.log(err);
                    return complete().setBody(derr).runtimeError().done();
                } else {
                    console.log("complete");
                    
                    return complete().setBody().ok().done();
                }

            });
        });
    };

    flexFunctions.register('ordercache', writeOrderData);
});