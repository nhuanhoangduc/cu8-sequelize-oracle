**Cu8-sequelize-oracle**
===================


Hey! I'm Nhua Nhua, who came from Mars. Wish you have a nice day and feel comfortable with fucking Oracle DB and NodeJs.


> **Note:**
> - Fix old functions and add more features to sequelize-oracle
> - Forked repository: [Sequelize-oracle](https://github.com/adeo-proxideco/sequelize-oracle)


***_Change logs_***

 - 0.0.4 Add destroy function for deleting objects
 - 0.0.5 Add $regexp_like comparator. $regexp_like: 'string'
 - 0.0.6 Add TEXT (CLOB) type
 - 0.0.7 Add Sequelize.getCLOB, Sequelize.insertCLOB, Sequelize.updateCLOB
   - Sequelize.prototype.getCLOB = function(results, ClobFields, done)
    ```javascript
        model.findAll({
          maxRows: 99999
        }).then(function(results) {

          Sequelize.getCLOB(results, ['Field1_type_clob', 'Field2_type_clob'], function(err, list) {
            console.log(err);
            console.log(list);
          });

        }).catch(next);
    ```
    - Sequelize.prototype.updateCLOB = function(model, data, search, ClobFields, done)
    ```javascript
    Sequelize.updateCLOB(model, req.body, {ID: req.body.ID}, ['Field1_type_clob', 'Field2_type_clob'], function (err) {
      if (err)
        return next(err);
      res.sendStatus(200);
    });
    ```
    - Sequelize.prototype.insertCLOB = function(model, data, primaryKey, ClobFields, done)
    ```javascript
    Sequelize
      .insertCLOB(model, req.body, 'ID', ['Field1_type_clob', 'Field2_type_clob'], function (err, result) {
          res.send(result);
        });
    ```
