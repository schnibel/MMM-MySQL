/* Magic Mirror
 * Module: MMM-MySQL
 *
 * By Schnibel @schnibel
 * January 2019
 * MIT Licensed.
 *
 */

var mysql = require('mysql');
var NodeHelper = require('node_helper');

module.exports = NodeHelper.create({

	start: function() {
		console.log("Starting node helper: " + this.name);	
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;

		/**console.log("Notification: " + notification + " host: " + payload.config.host
		                                            + " user: " + payload.config.user
		                                            + " password: " + payload.config.password
		                                            + " database: " + payload.config.database
		                                            ); **/

        if(notification === "GET_SENSORS") {

			var connection = mysql.createConnection({
				host: payload.config.host,
				user: payload.config.user,
				password: payload.config.password,
				database: payload.config.database,
				multipleStatements: true
			});

			var sensor_obj = {
                table_col1: payload.table_col1,
                table_col2: payload.table_col2,
                table_col3: payload.table_col3,
                table_col4: payload.table_col4,
                type: payload.type,
                name_col1: payload.name_col1,
                name_col2: payload.name_col2,
                name_col3: payload.name_col3,
                name_col4: payload.name_col4,
                unit_col1: payload.unit_col1,
                unit_col2: payload.unit_col2,
                unit_col3: payload.unit_col3,
                unit_col4: payload.unit_col4,
                verylow_threshold: payload.verylow_threshold,
                low_threshold: payload.low_threshold,
                high_threshold: payload.high_threshold,
                veryhigh_threshold: payload.veryhigh_threshold,
			};

//			console.log("type: " + payload.type);
//		    console.log("unit_col1: " + payload.unit_col1);
//		    console.log("unit_col2: " + payload.unit_col2);
//		    console.log("unit_col3: " + payload.unit_col3);
//		    console.log("unit_col4: " + payload.unit_col4);
//		    console.log("name_col1: " + payload.name_col1);
//		    console.log("name_col2: " + payload.name_col2);
//		    console.log("name_col3: " + payload.name_col3);
//		    console.log("name_col4: " + payload.name_col4);
//		    console.log("verylow_threshold: " + payload.verylow_threshold);
//			console.log("low_threshold: " + payload.low_threshold);
//			console.log("high_threshold: " + payload.high_threshold);
//		    console.log("veryhigh_threshold: " + payload.veryhigh_threshold);

            var sql_stmt = "";
            if ((sensor_obj.type === "temperature") || (sensor_obj.type === "hygrometrie")) {
                var selectLastUpdate = "SELECT DATE_FORMAT(time,'%d') AS lastUpdate_day, DATE_FORMAT(time,'%m') AS lastUpdate_month, DATE_FORMAT(time,'%y') AS lastUpdate_year, DATE_FORMAT(time,'%H:%i') AS lastUpdate_hour, IF(time BETWEEN DATE_SUB(now(),INTERVAL " + payload.config.show_alert_lastupdate_older + " MINUTE) AND now() , 'true', 'false') AS recently_updated FROM " + sensor_obj.table_col1 + " ORDER BY time DESC LIMIT 1;";
                var selectCol1 = "SELECT ROUND((value), 1) as value FROM " + sensor_obj.table_col1 + " ORDER by time desc LIMIT 1;";
                var selectCol2="SELECT ROUND(AVG(items.value), 1) as value FROM (SELECT value FROM " + sensor_obj.table_col1 + " WHERE time BETWEEN DATE_SUB(" + payload.config.dateTo + ", INTERVAL " + payload.config.searchInterval + " DAY) AND " + payload.config.dateTo + " ORDER BY time DESC) items;";
                var selectCol3="SELECT ROUND(MIN(items.value), 1) as value FROM (SELECT value FROM " + sensor_obj.table_col1 + " WHERE time BETWEEN DATE_SUB(" + payload.config.dateTo + ", INTERVAL " + payload.config.searchInterval + " DAY) AND " + payload.config.dateTo + " ORDER BY time DESC) items;";
                var selectCol4="SELECT ROUND(MAX(items.value), 1) as value FROM (SELECT value FROM " + sensor_obj.table_col1 + " WHERE time BETWEEN DATE_SUB(" + payload.config.dateTo + ", INTERVAL " + payload.config.searchInterval + " DAY) AND " + payload.config.dateTo + " ORDER BY time DESC) items;";
                sql_stmt = selectLastUpdate+selectCol1+selectCol2+selectCol3+selectCol4;    
            }
            else if (sensor_obj.type === "flower") {
                var selectLastUpdate = "SELECT DATE_FORMAT(time,'%d') AS lastUpdate_day, DATE_FORMAT(time,'%m') AS lastUpdate_month, DATE_FORMAT(time,'%y') AS lastUpdate_year, DATE_FORMAT(time,'%H:%i') AS lastUpdate_hour, IF(time BETWEEN DATE_SUB(now(),INTERVAL " + payload.config.show_alert_lastupdate_older + " MINUTE) AND now() , 'true', 'false') AS recently_updated FROM " + sensor_obj.table_col1 + " ORDER BY time DESC LIMIT 1;";
                var selectCol1 = "SELECT ROUND((value), 0) as value from  " + sensor_obj.table_col1 + " ORDER by time desc LIMIT 1;";
                var selectCol2="SELECT ROUND((value), 1) as value from  " + sensor_obj.table_col2 + " ORDER by time desc LIMIT 1;";
                var selectCol3="SELECT ROUND((value), 1) as value from  " + sensor_obj.table_col3 + " ORDER by time desc LIMIT 1;";
                var selectCol4="SELECT ROUND((value), 0) as value from  " + sensor_obj.table_col4 + " ORDER by time desc LIMIT 1;";
                sql_stmt = selectLastUpdate+selectCol1+selectCol2+selectCol3+selectCol4;    
            }
			
          //console.log("sql_stmt = " + sql_stmt);

            var func = function(callback) {
                if (sql_stmt !== "") {
                    connection.connect();

                    connection.query(sql_stmt, function(err, rows, fields) {
                        if(err) {
                            throw err;
                        }

                        callback(rows);
                    });

                    connection.end();
                }
            }

            func(function(rows) {
                //console.log("rows[0].lastUpdate_day : " + rows[0][0].lastUpdate_day);
                //console.log("rows[0].lastUpdate_month : " + rows[0][0].lastUpdate_month);
                //console.log("rows[0].lastUpdate_year : " + rows[0][0].lastUpdate_year);
                //console.log("rows[0].lastUpdate_hour : " + rows[0][0].lastUpdate_hour);
                //console.log("rows[0].recently_updated : " + rows[0][0].recently_updated);
                //console.log("rows[0].col1 : " + rows[1][0].value);
                //console.log("rows[0].col2 : " + rows[2][0].value);
                //console.log("rows[0].col3 : " + rows[3][0].value);
                //console.log("rows[0].col4 : " + rows[4][0].value);
                //console.log("-------------- : ");

                (rows[0][0] !== undefined) ? sensor_obj.lastUpdate_day = rows[0][0].lastUpdate_day : sensor_obj.lastUpdate_day = "--";
                (rows[0][0] !== undefined) ? sensor_obj.lastUpdate_month = rows[0][0].lastUpdate_month : sensor_obj.lastUpdate_month = "--";
                (rows[0][0] !== undefined) ? sensor_obj.lastUpdate_year = rows[0][0].lastUpdate_year : sensor_obj.lastUpdate_year = "--";
                (rows[0][0] !== undefined) ? sensor_obj.lastUpdate_hour = rows[0][0].lastUpdate_hour : sensor_obj.lastUpdate_hour = "--";
                (rows[0][0] !== undefined) ? sensor_obj.recently_updated = rows[0][0].recently_updated : sensor_obj.recently_updated = "true";
                (rows[1][0] !== undefined) ? sensor_obj.col1 = rows[1][0].value : sensor_obj.col1 = "--";
                (rows[2][0] !== undefined) ? sensor_obj.col2 = rows[2][0].value : sensor_obj.col2 = "--";
                (rows[3][0] !== undefined) ? sensor_obj.col3 = rows[3][0].value : sensor_obj.col3 = "--";
                (rows[4][0] !== undefined) ? sensor_obj.col4 = rows[4][0].value : sensor_obj.col4 = "--";

                self.sendSocketNotification("RESULT_SENSORS", sensor_obj);
            });
		}
    }
});
