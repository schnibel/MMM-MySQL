/* Magic Mirror
 * Module: MMM-MySQL
 *
 * By Schnibel @schnibel
 * January 2019
 * MIT Licensed.
 *
 */

// Needs npm install mysql


Module.register("MMM-MySQL",{

    defaults: {
        updateInterval: 5 * 60 * 1000,
        animationSpeed: 2.5 * 1000,
	},

	// Override dom generator.
	getDom: function() {
	    var table = document.createElement("table");

        // **************************************************************
	    // Header
        // **************************************************************
	    var thead = document.createElement("thead");

            // Table overall headers
	        var tr = document.createElement("tr");

                // Column 'Location' header
                if (this.config.show_room) {
                    var th = document.createElement("th");
                    th.classList.add("xsmall");
                    if (this.config.recently_updated === 'true') th.classList.add("bg-primary");
                    else th.classList.add("bg-primary-old");
                    th.style.textAlign = 'center';
                    th.style.align = 'center';
                    th.setAttribute("scope", "col");
                    th.setAttribute("rowspan", "2");
                    th.textContent = this.config.lastUpdate;
                    tr.appendChild(th);
                }

                // Column 'Values' header
                var th = document.createElement("th");
                th.classList.add("xsmall");
                th.classList.add("bg-primary");
                th.style.textAlign = 'center';
                th.style.align = 'center';
                th.setAttribute("scope", "col");
                th.setAttribute("colspan", "6");
                th.textContent = this.config.title;
                tr.appendChild(th);

            thead.appendChild(tr);

            // Table details headers
	        var tr = document.createElement("tr");

                // Column '1' header
                var th = document.createElement("th");
                th.classList.add("xsmall", "bg-muted");
                th.style.textAlign = 'center';
                th.style.align = 'center';
                th.setAttribute("scope", "col");
                th.textContent = this.config.name_col1;
                tr.appendChild(th);

                // Column '2' header
                var th = document.createElement("th");
                th.classList.add("xsmall", "bg-muted");
                th.style.textAlign = 'center';
                th.style.align = 'center';
                th.setAttribute("scope", "col");
                th.textContent = this.config.name_col2;
                tr.appendChild(th);

                // Column '3' header
                var th = document.createElement("th");
                th.classList.add("xsmall", "bg-muted");
                th.style.textAlign = 'center';
                th.style.align = 'center';
                th.setAttribute("scope", "col");
                th.textContent = this.config.name_col3;
                tr.appendChild(th);

                // Column '4' header
                var th = document.createElement("th");
                th.classList.add("xsmall", "bg-muted");
                th.style.textAlign = 'center';
                th.style.align = 'center';
                th.setAttribute("scope", "col");
                th.textContent = this.config.name_col4;
                tr.appendChild(th);

            thead.appendChild(tr);

        // **************************************************************
	    // Body
        // **************************************************************
	    var tbody = document.createElement("tbody");

            //
		for(var i = 0; i < this.sensors.length; i++) {
	        var tr = document.createElement("tr");

                // Column 'Location' header
                if (this.config.show_room) {
                    var th = document.createElement("th");
                    //th.classList.add("xsmall", "bg-muted");
                    th.classList.add("xsmall");
                    if (this.sensors[i].recently_updated === 'true') 
                    {
                        th.textContent = this.sensors[i].room + " : ";
                        th.classList.add("bg-muted");
                    }
                    else {
                        th.textContent = this.sensors[i].room + " (" + this.sensors[i].lastUpdate_hour + ")";
                        th.classList.add("bg-muted-old");
                    }
                    th.style.align = 'center';
                    th.style.textAlign = 'right';
                    th.setAttribute("scope", "row");
                    tr.appendChild(th);
                }

                // Column '1' value
                var td = document.createElement("td");
                td.classList.add("xsmall");
                td.classList.add(this.sensors[i].col1Class);
                td.style.align = 'center';
                td.textContent = this.sensors[i].col1;
                tr.appendChild(td);

                // Column '2' value
                var td = document.createElement("td");
                td.classList.add("xsmall");
                td.classList.add(this.sensors[i].col2Class);
                td.style.align = 'center';
                td.textContent = this.sensors[i].col2;
                tr.appendChild(td);

                // Column '3' value
                var td = document.createElement("td");
                td.classList.add("xsmall");
                td.classList.add(this.sensors[i].col3Class);
                td.style.align = 'center';
                td.textContent = this.sensors[i].col3;
                tr.appendChild(td);

                // Column '4' value
                var td = document.createElement("td");
                td.classList.add("xsmall");
                td.classList.add(this.sensors[i].col4Class);
                td.style.align = 'center';
                td.textContent = this.sensors[i].col4;
                tr.appendChild(td);

            tbody.appendChild(tr);
        }

        //
        table.appendChild(thead);
        table.appendChild(tbody);

        return table
	},

    initialize: function() {
        // Parse sensors from config.
        this.sensors = [];
        for(var i = 0; i < this.config.sensors.length; i++) {

            var room = "";
            if(this.config.sensors[i].hasOwnProperty("room")) {
                room = this.config.sensors[i].room;
            }

            var verylow_threshold = this.config.default_verylow_threshold;
            if(this.config.sensors[i].hasOwnProperty("verylow_threshold")) {
                verylow_threshold = this.config.sensors[i].verylow_threshold;
            }

            var low_threshold = this.config.default_low_threshold;
            if(this.config.sensors[i].hasOwnProperty("low_threshold")) {
                low_threshold = this.config.sensors[i].low_threshold;
            }

            var high_threshold = this.config.default_high_threshold;
            if(this.config.sensors[i].hasOwnProperty("high_threshold")) {
                high_threshold = this.config.sensors[i].high_threshold;
            }

            var veryhigh_threshold = this.config.default_veryhigh_threshold;
            if(this.config.sensors[i].hasOwnProperty("veryhigh_threshold")) {
                veryhigh_threshold = this.config.sensors[i].veryhigh_threshold;
            }

            var unit_col1 = this.config.default_unit_col1;
            if(this.config.sensors[i].hasOwnProperty("unit_col1")) {
                unit_col1 = this.config.sensors[i].unit_col1;
            }

            var unit_col2 = this.config.default_unit_col2;
            if(this.config.sensors[i].hasOwnProperty("unit_col2")) {
                unit_col2 = this.config.sensors[i].unit_col2;
            }

            var unit_col3 = this.config.default_unit_col3;
            if(this.config.sensors[i].hasOwnProperty("unit_col3")) {
                unit_col3 = this.config.sensors[i].unit_col3;
            }

            var unit_col4 = this.config.default_unit_col4;
            if(this.config.sensors[i].hasOwnProperty("unit_col4")) {
                unit_col5 = this.config.sensors[i].unit_col4;
            }

            //			Log.info("type: " + this.config.type);
            //		    Log.info("unit_col1: " + this.config.sensors[i].unit_col1);
            //		    Log.info("unit_col2: " + this.config.sensors[i].unit_col2);
            //		    Log.info("unit_col3: " + this.config.sensors[i].unit_col3);
            //		    Log.info("unit_col4: " + this.config.sensors[i].unit_col4);
            //			Log.info("dateTo: " + this.config.sensors[i].dateTo);
            //			Log.info("searchInterval: " + this.config.sensors[i].searchInterval);
            //			Log.info("remote_sensor_id: " + this.config.sensors[i].remote_sensor_id);
            //			Log.info("show_data: " + this.config.sensors[i].show_data);
            //			Log.info("warning: " + this.config.warning);
            //			Log.info("alert: " + this.config.alert);

            this.sensors.push({
                table_col1: this.config.sensors[i].table_col1,
                table_col2: this.config.sensors[i].table_col2,
                table_col3: this.config.sensors[i].table_col3,
                table_col4: this.config.sensors[i].table_col4,
                type: this.config.type,
                name_col1: this.config.name_col1,
                name_col2: this.config.name_col2,
                name_col3: this.config.name_col3,
                name_col4: this.config.name_col4,
                unit_col1: unit_col1,
                unit_col2: unit_col2,
                unit_col3: unit_col3,
                unit_col4: unit_col4,
                show_data: this.config.sensors[i].show_data,
                show_room: this.config.show_room,
                show_alert: this.config.show_alert,
                show_alert_lastupdate_older: this.config.show_alert_lastupdate_older,
                verylow_threshold: verylow_threshold,
                low_threshold: low_threshold,
                high_threshold: high_threshold,
                veryhigh_threshold: veryhigh_threshold,
                room: this.config.sensors[i].room
            });
        }
    },

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

        this.initialize();
		this.getSensors();
	},

	getSensors: function() {
		Log.info("Getting sensors");

        this.counter = 0;
        //console.log("getSensors - nb sensors : " + this.sensors.length + " / counter = " + this.counter);
		for(var i = 0; i < this.sensors.length; i++) {

			this.sendSocketNotification("GET_SENSORS",
				{
				    config: this.config,

                    table_col1: this.sensors[i].table_col1,
                    table_col2: this.sensors[i].table_col2,
                    table_col3: this.sensors[i].table_col3,
                    table_col4: this.sensors[i].table_col4,
                    type: this.sensors[i].type,
				    name_col1: this.sensors[i].name_col1,
				    name_col2: this.sensors[i].name_col2,
				    name_col3: this.sensors[i].name_col3,
				    name_col4: this.sensors[i].name_col4,
				    unit_col1: this.sensors[i].unit_col1,
				    unit_col2: this.sensors[i].unit_col2,
				    unit_col3: this.sensors[i].unit_col3,
				    unit_col4: this.sensors[i].unit_col4,
                    verylow_threshold: this.sensors[i].verylow_threshold,
                    low_threshold: this.sensors[i].low_threshold,
                    high_threshold: this.sensors[i].high_threshold,
                    veryhigh_threshold: this.sensors[i].veryhigh_threshold,
                }
            );
        }
	},



	socketNotificationReceived: function(notification, payload) {

		if(notification === "RESULT_SENSORS") {
			//Log.info("Received sensor data");

            this.config.recently_updated = "true";
            //console.log("socketNotificationReceived : " + this.sensors.length);


			for(var i = 0; i < this.sensors.length; i++) {
                if( ((payload.table_col1 !== undefined) && (this.sensors[i].table_col1 === payload.table_col1)) ||
                    ((payload.table_col2 !== undefined) && (this.sensors[i].table_col2 === payload.table_col2)) ||
                    ((payload.table_col3 !== undefined) && (this.sensors[i].table_col3 === payload.table_col3)) ||
                    ((payload.table_col4 !== undefined) && (this.sensors[i].table_col4 === payload.table_col4))) {
                        
                    this.sensors[i].lastUpdate_day = payload.lastUpdate_day;
                    this.sensors[i].lastUpdate_month = payload.lastUpdate_month;
                    this.sensors[i].lastUpdate_year = payload.lastUpdate_year;
                    this.sensors[i].lastUpdate_hour = payload.lastUpdate_hour;
                    this.sensors[i].recently_updated = payload.recently_updated;
                    this.sensors[i].show_data = payload.show_data;

					(payload.col1 !== "--") ? this.sensors[i].col1 = parseFloat(payload.col1) + this.sensors[i].unit_col1 : this.sensors[i].col1 = "--";
					this.sensors[i].col1Class = this.getCellClass("col1", payload.col1, payload.verylow_threshold, payload.low_threshold, payload.high_threshold, payload.veryhigh_threshold);

					(payload.col2 !== "--") ? this.sensors[i].col2 = parseFloat(payload.col2) + this.sensors[i].unit_col2 : this.sensors[i].col2 = "--";;
					this.sensors[i].col2Class = this.getCellClass("col2", payload.col2, payload.verylow_threshold, payload.low_threshold, payload.high_threshold, payload.veryhigh_threshold);

                    (payload.col3 !== "--") ? this.sensors[i].col3 = parseFloat(payload.col3) + this.sensors[i].unit_col3 : this.sensors[i].col3 = "--";;
					this.sensors[i].col3Class = this.getCellClass("col3", payload.col3, payload.verylow_threshold, payload.low_threshold, payload.high_threshold, payload.veryhigh_threshold);

					(payload.col4 !== "--") ? this.sensors[i].col4 = parseFloat(payload.col4) + this.sensors[i].unit_col4 : this.sensors[i].col4 = "--";;
					this.sensors[i].col4Class = this.getCellClass("col4", payload.col4, payload.verylow_threshold, payload.low_threshold, payload.high_threshold, payload.veryhigh_threshold);

                    this.counter = this.counter + 1;    // counter is used to know when it will be necessary to updateDom
                    break; // This is not necessary to stay in the 'for' loop as we got data
				}

            }
            
            // BAD CODE... TODO
            if (this.counter === this.sensors.length) {
                //console.log("socketNotificationReceived - nb sensors : " + this.sensors.length + " / counter = " + this.counter);
                this.counter = 0;

                var oldest_update;
                for (var i = 0 ; i < this.sensors.length ; i++) {
                    var temp_datetime = this.sensors[i].lastUpdate_year + this.sensors[i].lastUpdate_month + this.sensors[i].lastUpdate_day + this.sensors[i].lastUpdate_hour;
                    temp_datetime = temp_datetime.toLowerCase().replace(/[^0-9]+/g, "")
                    if ((temp_datetime !== "") && (oldest_update === undefined || temp_datetime < oldest_update)) {
                        oldest_update = temp_datetime;

                        this.config.lastUpdate = this.sensors[i].lastUpdate_day + "/" + this.sensors[i].lastUpdate_month + "/" + this.sensors[i].lastUpdate_year + " à " + this.sensors[i].lastUpdate_hour;
                        this.config.recently_updated = this.sensors[i].recently_updated;

                        //console.log("lastUpdate = " + this.config.lastUpdate + " / oldest = " + oldest_update);
                    }
                }

                this.scheduleUpdateInterval();
            }
		}
	},


    // ClassName to display data
    getCellClass: function(column, value, verylow_threshold, low_threshold, high_threshold, veryhigh_threshold) {
        var cellClassList = "";

        var verylow_threshold_col = "";
        var low_threshold_col = "";
        var high_threshold_col = "";
        var veryhigh_threshold_col = "";

        if (column === "col1") {
            verylow_threshold_col = verylow_threshold.col1;
            low_threshold_col = low_threshold.col1;
            high_threshold_col = high_threshold.col1;
            veryhigh_threshold_col = veryhigh_threshold.col1;
        }
        else if (column === "col2") {
            verylow_threshold_col = verylow_threshold.col2;
            low_threshold_col = low_threshold.col2;
            high_threshold_col = high_threshold.col2;
            veryhigh_threshold_col = veryhigh_threshold.col2;
        }
        else if (column === "col3") {
            verylow_threshold_col = verylow_threshold.col3;
            low_threshold_col = low_threshold.col3;
            high_threshold_col = high_threshold.col3;
            veryhigh_threshold_col = veryhigh_threshold.col3;
        }
        else if (column === "col4") {
            verylow_threshold_col = verylow_threshold.col4;
            low_threshold_col = low_threshold.col4;
            high_threshold_col = high_threshold.col4;
            veryhigh_threshold_col = veryhigh_threshold.col4;
        }


        if (this.config.show_alert) {
            if (value <= verylow_threshold_col)
                cellClassList = "bg-verylow";
            else if (value <= low_threshold_col)
                cellClassList = "bg-low";
            else if (value <= high_threshold_col)
                cellClassList = "bg-normal";
            else if (value <= veryhigh_threshold_col)
                cellClassList = "bg-high";
            else 
                cellClassList = "bg-veryhigh";
        }
        else cellClassList = "bg-normal";

		return cellClassList;
    },

    cleanup: function() {
        return this.toLowerCase().replace(/[^0-9]+/g, "-");
     },

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required styles.
	getStyles: function() {
		return ["MMM-MySQL.css"];
    },
    

    scheduleUpdateInterval: function() {
        var self = this;

        self.updateDom(self.config.animationSpeed);

        timer = setInterval(function() {
            self.getSensors();
        }, this.config.updateInterval);
    },


});
