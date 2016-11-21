**Cu8-sequelize-oracle**
===================

3===> New Feature - CLOB auto loading 
=======

Hey! I'm Nhua Nhua, who came from Mars. Wish you have a nice day and feel comfortable with fucking Oracle DB and NodeJs.


> **Note:**
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
   - Connection pool (Setup in ./lib/dialects/abstract/connection-manager.js at line 79) :
      ```javascript
          connectionConfig.poolMax = 20;
          connectionConfig.poolMin = 0;
          connectionConfig.poolTimeout = 69;
          connectionConfig.queueRequests = true;
      ```
 - 1.0.5 Fix join model cannot load CLOB

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
