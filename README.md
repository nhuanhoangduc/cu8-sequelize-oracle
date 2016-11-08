**Cu8-sequelize-oracle**
===================


Hey! I'm Nhua Nhua, who came from Mars. Wish you have a nice day and feel comfortable with fucking Oracle DB and NodeJs.


> **Note:**https://github.com/nhuanhoangduc/cu8-sequelize-oracle/issues
> - Fix old functions and add more features to sequelize-oracle
> - Forked repository: [Sequelize-oracle](https://github.com/adeo-proxideco/sequelize-oracle)


***_Change logs_***

 - 0.0.4 Add destroy function for deleting objects
     ```javascript
        model
            .destroy({where: {ID: 123}})
            .then()
            .catch();
    ```
 - 0.0.5 Add $regexp_like comparator. $regexp_like: 'string'
 - 0.0.6 Add TEXT (CLOB) type
 - 0.0.7 Add Sequelize.insertCLOB, Sequelize.updateCLOB
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
 - 1.0.0 
   - Get CLOB data
       ```javascript
          model.findAll({
            clobAttributes: ['Field1_type_clob', 'Field2_type_clob']
          }).then(function(results) {
            res.json(results);
          }).catch(next);
      ```
   - Connection pool (Setup in ./lib/dialects/abstract/connection-manager.js at line 79) :
      ```javascript
          connectionConfig.poolMax = 20;
          connectionConfig.poolMin = 0;
          connectionConfig.poolTimeout = 69;
          connectionConfig.queueRequests = true;
      ```

**DataType: only this dataTypes are managed:**

    STRING (=VARCHAR2)
    CHAR
    DECIMAL (=NUMBER)
    BIGINT (=NUMBER(19,0))
    INTEGER
    FLOAT
    DOUBLE
    UUID (=CHAR 36)
    DATE (=TIMESTAMP WITH LOCAL TIME ZONE)
    DATEONLY (=DATETIME)
    BOOLEAN (=NUMBER(1))
    TEXT (=CLOB)