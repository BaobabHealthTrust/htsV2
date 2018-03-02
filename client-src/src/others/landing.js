"use strict"

if (Object.getOwnPropertyNames(Date.prototype).indexOf("format") < 0) {

    Object.defineProperty(Date.prototype, "format", {
        value: function (format) {
            var date = this;

            var result = "";

            if (!format) {

                format = ""

            }

            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                "October", "November", "December"];

            if (format.match(/YYYY\-mm\-dd\sHH\:\MM\:SS/)) {

                result = date.getFullYear() + "-" + landing.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    landing.padZeros(date.getDate(), 2) + " " + landing.padZeros(date.getHours(), 2) + ":" +
                    landing.padZeros(date.getMinutes(), 2) + ":" + landing.padZeros(date.getSeconds(), 2);

            } else if (format.match(/YYYY\-mm\-dd/)) {

                result = date.getFullYear() + "-" + landing.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    landing.padZeros(date.getDate(), 2);

            } else if (format.match(/mmm\/d\/YYYY/)) {

                result = months[parseInt(date.getMonth())] + "/" + date.getDate() + "/" + date.getFullYear();

            } else if (format.match(/d\smmmm,\sYYYY/)) {

                result = date.getDate() + " " + monthNames[parseInt(date.getMonth())] + ", " + date.getFullYear();

            } else {

                result = date.getDate() + "/" + months[parseInt(date.getMonth())] + "/" + date.getFullYear();

            }

            return result;
        }
    });

}

// Supporting function to allow a humanized Concept Name display
if (Object.getOwnPropertyNames(String.prototype).indexOf("toProperCase") < 0) {

    String.prototype.toProperCase = function () {
        return this.toLowerCase().replace(/^(.)|\s(.)/g,
            function ($1) {
                return $1.toUpperCase();
            });
    }

}

Object.defineProperty(Array.prototype, "shuffle", {
    value: function () {
        var array = this;

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * i); // no +1 here!
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
});

var landing = ({

    version: "0.1.1",

    $: function (id) {
        return document.getElementById(id);
    },

    $$: function (id) {

        if (this.$("ifrMain")) {

            return this.$("ifrMain").contentWindow.document.getElementById(id);

        }

    },

    __: function (id) {

        if (this.$("ifrMain")) {

            return this.$("ifrMain").contentWindow;

        }

    },

    setData: function (key, data) {
        this[key] = data;
    },

    getData: function (key) {
        return this[key];
    },

    sheet: function () {
        // Create the <style> tag
        var style = document.createElement("style");

        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    },

    addCSSRule: function (sheet, selector, rules, index) {

        if ("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", (index || 0));
        }
        else if ("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }

    },

    setCookie: function (cname, cvalue, exdays, base) {

        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=" + (base ? base : "/");

    },

    getCookie: function (cname) {

        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";

    },

    padZeros: function (number, positions) {
        var zeros = parseInt(positions) - String(number).length;
        var padded = "";

        for (var i = 0; i < zeros; i++) {
            padded += "0";
        }

        padded += String(number);

        return padded;
    },

    buildPage: function (callback) {

        var style = this.sheet();
        this.addCSSRule(style, "body", "padding: 0px !important");
        this.addCSSRule(style, "body", "overflow: hidden");
        this.addCSSRule(style, "body", "margin: 0px");
        this.addCSSRule(style, ".headTab", "width: 100%");
        this.addCSSRule(style, ".headTab", "box-shadow: 5px 2px 5px 0px rgba(0,0,0,0.75)");
        this.addCSSRule(style, ".headTab", "overflow: hidden");
        this.addCSSRule(style, ".headTab", "height: 120px");
        this.addCSSRule(style, ".headTab", "border: 1px solid #004586");
        this.addCSSRule(style, ".blueText", "color: #3c60b1");

        this.addCSSRule(style, "button", "font-size: 22px !important");
        this.addCSSRule(style, "button", "padding: 15px;");
        this.addCSSRule(style, "button", "min-width: 120px");
        this.addCSSRule(style, "button", "cursor: pointer");
        this.addCSSRule(style, "button", "min-height: 55px");
        this.addCSSRule(style, "button", "border-radius: 5px !important");
        this.addCSSRule(style, "button", "margin: 3px");

        this.addCSSRule(style, "button:active", "background-color: #ffc579 !important");
        this.addCSSRule(style, "button:active", "background-image: -webkit-gradient(linear, left top, left bottom, from(#ffc579), to(#fb9d23)) !important");
        this.addCSSRule(style, "button:active", "background-image: -webkit-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -moz-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -ms-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -o-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: linear-gradient(to bottom, #ffc579, #fb9d23)");
        this.addCSSRule(style, "button:active", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#ffc579, endColorstr=#fb9d23) !important");

        this.addCSSRule(style, ".blue", "border: 1px solid #7eb9d0");
        this.addCSSRule(style, ".blue", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".blue", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".blue", "border-radius: 3px");
        this.addCSSRule(style, ".blue", "font-size: 28px");
        this.addCSSRule(style, ".blue", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".blue", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".blue", "text-decoration: none");
        this.addCSSRule(style, ".blue", "display: inline-block");
        this.addCSSRule(style, ".blue", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".blue", "font-weight: bold");
        this.addCSSRule(style, ".blue", "color: #FFFFFF");
        this.addCSSRule(style, ".blue", "background-color: #a7cfdf");
        this.addCSSRule(style, ".blue", "background-image: -webkit-gradient(linear, left top, left bottom, from(#a7cfdf), to(#23538a))");
        this.addCSSRule(style, ".blue", "background-image: -webkit-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -moz-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -ms-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -o-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: linear-gradient(to bottom, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a7cfdf, endColorstr=#23538a)");

        this.addCSSRule(style, ".blue:hover", "border: 1px solid #5ca6c4");
        this.addCSSRule(style, ".blue:hover", "background-color: #82bbd1");
        this.addCSSRule(style, ".blue:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#82bbd1), to(#193b61))");
        this.addCSSRule(style, ".blue:hover", "background-image: -webkit-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -moz-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -ms-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -o-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: linear-gradient(to bottom, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#82bbd1, endColorstr=#193b61)");

        this.addCSSRule(style, ".green", "border: 1px solid #34740e");
        this.addCSSRule(style, ".green", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".green", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".green", "border-radius: 3px");
        this.addCSSRule(style, ".green", "font-size: 28px");
        this.addCSSRule(style, ".green", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".green", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".green", "text-decoration: none");
        this.addCSSRule(style, ".green", "display: inline-block");
        this.addCSSRule(style, ".green", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".green", "font-weight: bold");
        this.addCSSRule(style, ".green", "color: #FFFFFF");
        this.addCSSRule(style, ".green", "background-color: #4ba614");
        this.addCSSRule(style, ".green", "background-image: -webkit-gradient(linear, left top, left bottom, from(#4ba614), to(#008c00))");
        this.addCSSRule(style, ".green", "background-image: -webkit-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -moz-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -ms-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -o-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: linear-gradient(to bottom, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#4ba614, endColorstr=#008c00)");

        this.addCSSRule(style, ".green:hover", "border: 1px solid #224b09");
        this.addCSSRule(style, ".green:hover", "background-color: #36780f");
        this.addCSSRule(style, ".green:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#36780f), to(#005900))");
        this.addCSSRule(style, ".green:hover", "background-image: -webkit-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -moz-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -ms-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -o-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: linear-gradient(to bottom, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#36780f, endColorstr=#005900)");

        this.addCSSRule(style, ".red", "border: 1px solid #72021c");
        this.addCSSRule(style, ".red", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".red", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".red", "border-radius: 3px");
        this.addCSSRule(style, ".red", "font-size: 28px");
        this.addCSSRule(style, ".red", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".red", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".red", "text-decoration: none");
        this.addCSSRule(style, ".red", "display: inline-block");
        this.addCSSRule(style, ".red", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".red", "font-weight: bold");
        this.addCSSRule(style, ".red", "color: #FFFFFF");
        this.addCSSRule(style, ".red", "background-color: #a90329");
        this.addCSSRule(style, ".red", "background-image: -webkit-gradient(linear, left top, left bottom, from(#a90329), to(#6d0019))");
        this.addCSSRule(style, ".red", "background-image: -webkit-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -moz-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -ms-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -o-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: linear-gradient(to bottom, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a90329, endColorstr=#6d0019)");

        this.addCSSRule(style, ".red:hover", "border: 1px solid #450111");
        this.addCSSRule(style, ".red:hover", "background-color: #77021d");
        this.addCSSRule(style, ".red:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#77021d), to(#3a000d))");
        this.addCSSRule(style, ".red:hover", "background-image: -webkit-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -moz-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -ms-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -o-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: linear-gradient(to bottom, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#77021d, endColorstr=#3a000d)");

        this.addCSSRule(style, ".gray", "border: 1px solid #ccc");
        this.addCSSRule(style, ".gray", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".gray", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".gray", "border-radius: 3px");
        this.addCSSRule(style, ".gray", "font-size: 28px");
        this.addCSSRule(style, ".gray", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".gray", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".gray", "text-decoration: none");
        this.addCSSRule(style, ".gray", "display: inline-block");
        this.addCSSRule(style, ".gray", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".gray", "font-weight: bold");
        this.addCSSRule(style, ".gray", "color: #FFFFFF");
        this.addCSSRule(style, ".gray", "background-color: #ccc");
        this.addCSSRule(style, ".gray", "background-image: -webkit-gradient(linear, left top, left bottom, from(#ccc), to(#999))");
        this.addCSSRule(style, ".gray", "background-image: -webkit-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -moz-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -ms-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -o-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: linear-gradient(to bottom, #ccc, #999)");
        this.addCSSRule(style, ".gray", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#ccc, endColorstr=#999)");

        this.addCSSRule(style, ".gray:hover", "border: 1px solid #ccc");
        this.addCSSRule(style, ".gray:hover", "background-color: #ddd");
        this.addCSSRule(style, ".gray:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#333), to(#ccc))");
        this.addCSSRule(style, ".gray:hover", "background-image: -webkit-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -moz-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -ms-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -o-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: linear-gradient(to bottom, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#333, endColorstr=#ccc)");

        var table = document.createElement("table");
        table.width = "100%";
        table.border = 0;
        table.style.font = "14px \"Lucida Grande\", Helvetica, Arial, sans-serif";
        table.style.MozUserSelect = "none";
        table.style.borderCollapse = "collapse";

        document.body.appendChild(table);

        var tr1 = document.createElement("tr");

        table.appendChild(tr1);

        var td1_1 = document.createElement("td");
        td1_1.style.width = "75%";
        td1_1.style.padding = "5px";
        td1_1.style.paddingLeft = "15px";
        td1_1.colSpan = 3;

        tr1.appendChild(td1_1);

        var div1 = document.createElement("div");
        div1.className = "headTab";

        td1_1.appendChild(div1);

        var tableDiv1 = document.createElement("table");
        tableDiv1.cellPadding = 1;
        tableDiv1.width = "100%";
        tableDiv1.border = 0;

        div1.appendChild(tableDiv1);

        var trDiv1_1 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_1);

        var thDiv1_1_1 = document.createElement("th");
        thDiv1_1_1.style.fontSize = "20px";
        thDiv1_1_1.style.textAlign = "right";
        thDiv1_1_1.style.verticalAlign = "middle";
        thDiv1_1_1.style.width = "200px";
        thDiv1_1_1.style.overflow = "hidden";
        thDiv1_1_1.style.fontWeight = "normal";
        thDiv1_1_1.style.padding = "5px";
        thDiv1_1_1.style.paddingTop = "10px";
        thDiv1_1_1.className = "blueText";
        thDiv1_1_1.innerHTML = "Scan Person Barcode";

        trDiv1_1.appendChild(thDiv1_1_1);

        var tdDiv1_1_1_2 = document.createElement("td");
        tdDiv1_1_1_2.style.width = "60px";

        trDiv1_1.appendChild(tdDiv1_1_1_2);

        var img = document.createElement("img");
        img.setAttribute("src", landing['icoBarcode']);
        img.setAttribute('height', 40);
        img.style.marginTop = "10px";

        tdDiv1_1_1_2.appendChild(img);

        var tdDiv1_1_1_3 = document.createElement("td");
        tdDiv1_1_1_3.style.borderBottom = "1px solid #3c60b1";
        tdDiv1_1_1_3.colSpan = 6;
        tdDiv1_1_1_3.style.padding = "0px";

        trDiv1_1.appendChild(tdDiv1_1_1_3);

        var barcode = document.createElement("input");
        barcode.type = "input";
        barcode.style.fontSize = "24px";
        barcode.id = "barcode";
        barcode.style.width = "100%";
        barcode.style.border = "none";

        tdDiv1_1_1_3.appendChild(barcode);

        var trDiv1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_2);

        var trDiv1_3_1_1 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3_1_1);

        var tdDiv1_3_1_1_0_a = document.createElement("td");
        tdDiv1_3_1_1_0_a.innerHTML = "&nbsp;";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_0_a);

        var tdDiv1_3_1_1_0 = document.createElement("td");
        tdDiv1_3_1_1_0.innerHTML = "&nbsp;";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_0);

        var tdDiv1_3_1_1_1 = document.createElement("td");
        tdDiv1_3_1_1_1.style.textAlign = "right";
        tdDiv1_3_1_1_1.style.fontWeight = "bold";
        tdDiv1_3_1_1_1.className = "blueText";
        tdDiv1_3_1_1_1.innerHTML = "Facility";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_1);

        var tdDiv1_3_1_1_2 = document.createElement("td");
        tdDiv1_3_1_1_2.style.textAlign = "center";
        tdDiv1_3_1_1_2.style.width = "3px";
        tdDiv1_3_1_1_2.innerHTML = ":";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_2);

        var tdDiv1_3_1_1_3 = document.createElement("td");
        tdDiv1_3_1_1_3.id = "facility";
        tdDiv1_3_1_1_3.innerHTML = "&nbsp;";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_3);

        var trDiv1_3_1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3_1_2);

        var tdDiv1_3_1_1_4 = document.createElement("td");
        tdDiv1_3_1_1_4.style.textAlign = "right";
        tdDiv1_3_1_1_4.style.fontWeight = "bold";
        tdDiv1_3_1_1_4.className = "blueText";
        tdDiv1_3_1_1_4.innerHTML = "Date";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_4);

        var tdDiv1_3_1_1_5 = document.createElement("td");
        tdDiv1_3_1_1_5.style.textAlign = "center";
        tdDiv1_3_1_1_5.style.width = "3px";
        tdDiv1_3_1_1_5.innerHTML = ":";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_5);

        var today = (landing.getCookie("today").trim().length > 0 ?
            (new Date(landing.getCookie("today").trim())).format("d mmmm, YYYY") : (new Date()).format("d mmmm, YYYY"));

        var tdDiv1_3_1_1_6 = document.createElement("td");
        tdDiv1_3_1_1_6.id = "today";
        tdDiv1_3_1_1_6.innerHTML = today;

        if (landing.getCookie("today").trim().length > 0 && (new Date()).format("YYYY-mm-dd") !=
            (new Date(landing.getCookie("today").trim())).format("YYYY-mm-dd")) {

            tdDiv1_3_1_1_6.style.color = "red";
            tdDiv1_3_1_1_6.style.fontWeight = "bold";

        }

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_6);

        var trDiv1_3_1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3_1_2);

        var tdDiv1_3_1_2_0_a = document.createElement("td");
        tdDiv1_3_1_2_0_a.innerHTML = "&nbsp;";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_0_a);

        var tdDiv1_3_1_2_0 = document.createElement("td");
        tdDiv1_3_1_2_0.innerHTML = "&nbsp;";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_0);

        var tdDiv1_3_1_2_1 = document.createElement("td");
        tdDiv1_3_1_2_1.style.textAlign = "right";
        tdDiv1_3_1_2_1.style.fontWeight = "bold";
        tdDiv1_3_1_2_1.className = "blueText";
        tdDiv1_3_1_2_1.id = "other_id_label";
        tdDiv1_3_1_2_1.innerHTML = "Location";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_1);

        var tdDiv1_3_1_2_2 = document.createElement("td");
        tdDiv1_3_1_2_2.style.textAlign = "center";
        tdDiv1_3_1_2_2.style.width = "3px";
        tdDiv1_3_1_2_2.innerHTML = ":";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_2);

        var tdDiv1_3_1_2_3 = document.createElement("td");
        tdDiv1_3_1_2_3.id = "location";
        tdDiv1_3_1_2_3.innerHTML = "&nbsp;";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_3);

        var tdDiv1_3_1_2_4 = document.createElement("td");
        tdDiv1_3_1_2_4.style.textAlign = "right";
        tdDiv1_3_1_2_4.style.fontWeight = "bold";
        tdDiv1_3_1_2_4.className = "blueText";
        tdDiv1_3_1_2_4.id = "other_id_label";
        tdDiv1_3_1_2_4.innerHTML = "User";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_4);

        var tdDiv1_3_1_2_5 = document.createElement("td");
        tdDiv1_3_1_2_5.style.textAlign = "center";
        tdDiv1_3_1_2_5.style.width = "3px";
        tdDiv1_3_1_2_5.innerHTML = ":";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_5);

        var tdDiv1_3_1_2_6 = document.createElement("td");
        tdDiv1_3_1_2_6.id = "user";
        tdDiv1_3_1_2_6.innerHTML = "Test";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_6);

        var td1_4 = document.createElement("td");
        td1_4.style.width = "25%";
        td1_4.style.padding = "5px";
        td1_4.style.paddingRight = "15px";

        tr1.appendChild(td1_4);

        var div4 = document.createElement("div");
        div4.className = "headTab";
        div4.id = "modApp";
        div4.style.textAlign = "center";

        td1_4.appendChild(div4);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2_1 = document.createElement("td");
        td2_1.style.width = "100%";
        td2_1.style.padding = "5px";
        td2_1.style.paddingRight = "15px";
        td2_1.style.paddingLeft = "15px";
        td2_1.colSpan = 4;

        tr2.appendChild(td2_1);

        var div2_1 = document.createElement("div");
        div2_1.id = "main";
        div2_1.style.width = "100%";
        div2_1.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div2_1.style.overflow = "hidden";
        div2_1.style.height = "300px";
        div2_1.style.border = "1px solid #345db5";

        td2_1.appendChild(div2_1);

        var tableDiv2_1 = document.createElement("table");
        tableDiv2_1.width = "100%";
        tableDiv2_1.border = 1;
        tableDiv2_1.style.borderCollapse = "collapse";
        tableDiv2_1.style.border = "1px solid #345db5";
        tableDiv2_1.cellPadding = 5;
        tableDiv2_1.cellSpacing = 0;

        div2_1.appendChild(tableDiv2_1);

        var trDiv2_1 = document.createElement("tr");
        trDiv2_1.style.backgroundColor = "#345db5";

        tableDiv2_1.appendChild(trDiv2_1);

        var tdDiv2_1_1 = document.createElement("td");
        tdDiv2_1_1.style.width = "200px";
        tdDiv2_1_1.style.borderRight = "1px solid #fff";
        tdDiv2_1_1.style.color = "#fff";
        tdDiv2_1_1.style.textAlign = "left";
        tdDiv2_1_1.style.fontWeight = "bold";
        tdDiv2_1_1.style.paddingLeft = "10px";
        tdDiv2_1_1.innerHTML = "Programs";

        trDiv2_1.appendChild(tdDiv2_1_1);

        var tdDiv2_1_3 = document.createElement("td");
        tdDiv2_1_3.style.borderRight = "1px solid #fff";
        tdDiv2_1_3.style.color = "#fff";
        tdDiv2_1_3.style.textAlign = "center";
        tdDiv2_1_3.style.fontWeight = "bold";
        tdDiv2_1_3.innerHTML = "&nbsp;";
        tdDiv2_1_3.id = "header";

        trDiv2_1.appendChild(tdDiv2_1_3);

        var tdDiv2_1_4 = document.createElement("td");
        tdDiv2_1_4.style.width = "200px";
        tdDiv2_1_4.style.borderRight = "1px solid #fff";
        tdDiv2_1_4.style.color = "#fff";
        tdDiv2_1_4.style.textAlign = "left";
        tdDiv2_1_4.style.fontWeight = "bold";
        tdDiv2_1_4.style.paddingLeft = "10px";
        tdDiv2_1_4.innerHTML = "Menu";

        trDiv2_1.appendChild(tdDiv2_1_4);

        var trDiv2_2 = document.createElement("tr");

        tableDiv2_1.appendChild(trDiv2_2);

        var tdDiv2_2_1 = document.createElement("td");

        trDiv2_2.appendChild(tdDiv2_2_1);

        var div2_2_1 = document.createElement("div");
        div2_2_1.id = "programs";
        div2_2_1.style.width = "100%";
        div2_2_1.style.overflow = "auto";
        div2_2_1.style.height = "100%";
        div2_2_1.style.border = "1px solid #fff";

        tdDiv2_2_1.appendChild(div2_2_1);

        var tdDiv2_2_2 = document.createElement("td");

        trDiv2_2.appendChild(tdDiv2_2_2);

        var div2_2_2 = document.createElement("div");
        div2_2_2.style.width = "100%";
        div2_2_2.style.overflow = "hidden";
        div2_2_2.style.height = "100%";
        div2_2_2.style.border = "1px solid #fff";
        div2_2_2.style.padding = "0px";

        tdDiv2_2_2.appendChild(div2_2_2);

        var iframe = document.createElement("iframe");
        iframe.id = "visits";
        iframe.style.width = "99.8%";
        iframe.style.height = "100%";
        iframe.style.border = "3px inset #eee";

        div2_2_2.appendChild(iframe);

        var tdDiv2_2_4 = document.createElement("td");

        trDiv2_2.appendChild(tdDiv2_2_4);

        var div2_2_4 = document.createElement("div");
        div2_2_4.id = "tasks";
        div2_2_4.style.width = "100%";
        div2_2_4.style.overflow = "auto";
        div2_2_4.style.height = "100%";
        div2_2_4.style.border = "1px solid #fff";

        tdDiv2_2_4.appendChild(div2_2_4);

        var tr3 = document.createElement("tr");
        tr3.style.backgroundColor = "#333";

        table.appendChild(tr3);

        var td3_1 = document.createElement("td");
        td3_1.style.padding = "10px";
        td3_1.colSpan = 4;

        tr3.appendChild(td3_1);

        var btnCancel = document.createElement("button");
        btnCancel.className = "red";
        btnCancel.style.cssFloat = "left";
        btnCancel.innerHTML = "Logout";
        btnCancel.onmousedown = function () {
            if (user != undefined)
                user.logout();
        }

        td3_1.appendChild(btnCancel);

        var td3_2 = document.createElement("td");
        td3_2.style.padding = "10px";
        td3_2.style.textAlign = "right";

        // tr3.appendChild(td3_2);

        var btnFinish = document.createElement("button");
        btnFinish.className = "green";
        btnFinish.style.cssFloat = "right";
        btnFinish.innerHTML = "Find or Register Patient";
        btnFinish.onmousedown = function () {

            if (this.className.match(/gray/i))
                return;

            if (patient != undefined) {

                patient.buildSearchPage();

            }

        }

        td3_1.appendChild(btnFinish);

        if (landing.settings.useStartSessionButton === undefined ||
            (landing.settings.useStartSessionButton !== undefined && landing.settings.useStartSessionButton)) {

            var btnStart = document.createElement("button");
            btnStart.className = "green";
            btnStart.style.cssFloat = "right";
            btnStart.innerHTML = "Start Session";
            btnStart.id = "landing.btnStart";
            btnStart.style.minWidth = "180px";

            btnStart.onclick = function () {

                if (this.className.match(/gray/))
                    return;

                landing.startProtocol();

            }

            td3_1.appendChild(btnStart);

        }

        var btnToday = document.createElement("button");
        btnToday.id = "setDateButton";
        btnToday.className = "blue";
        btnToday.style.cssFloat = "right";
        btnToday.innerHTML = (landing.getCookie("today").trim().length > 0 ? "Reset Date" : "Set Date");
        btnToday.onmousedown = function () {

            if (this.innerHTML.match(/reset/i)) {

                landing.setCookie("today", "", 0, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

                if (landing.$("setDateButton")) {

                    landing.$("setDateButton").innerHTML = "Set Date";

                }

                window.location = (user.settings.defaultPath ? user.settings.defaultPath : "/");

            } else {

                landing.navPanel("/modules/set_date.html", true);

            }

        }

        td3_1.appendChild(btnToday);

        landing.loadPrograms(landing['modules'], landing.$("programs"));

        if (callback) {

            callback();

        }

    },

    setDate: function (date) {

        var selectedDate = (new Date(date));

        if (landing.$("landing.navPanel")) {

            document.body.removeChild(landing.$("landing.navPanel"));

        }

        if(selectedDate.format("YYYY-mm-dd") != (new Date()).format("YYYY-mm-dd")) {

            if (landing.$("setDateButton")) {

                landing.$("setDateButton").innerHTML = "Reset Date";

            }

            landing.setCookie("today", selectedDate, 0.3333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

        }

        window.location = (user.settings.defaultPath ? user.settings.defaultPath : "/");

    },

    startProtocol: function () {

        if (landing.$("landing.btnStart")) {

            landing.$("landing.btnStart").className = "gray";

            landing.$("landing.btnStart").innerHTML = "Initializing...";

        }

        var data = {
            data: {
                userId: landing.getCookie("username"),
                token: landing.getCookie("token"),
                prefix: landing.settings.prefix
            }
        };

        landing.ajaxPostRequest(landing.settings.dummyPatientCreatePath, data, function (barcode) {

            if (landing.$("barcode"))
                landing.$("barcode").value = barcode + "$";

        })

    },

    loadPrograms: function (sourceData, targetControl) {

        if (!sourceData || !targetControl) {

            return;

        }

        targetControl.innerHTML = "";

        var ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.width = "100%";
        ul.style.padding = "0px";
        ul.style.margin = "0px";

        targetControl.appendChild(ul);

        var keys = Object.keys(sourceData);

        if (keys.length <= 0)
            return;

        for (var i = 0; i < keys.length; i++) {

            var li = document.createElement("li");
            li.style.cursor = "pointer";
            li.style.marginBottom = "5px";
            li.style.borderBottom = "1px solid #ccc";
            li.id = keys[i];
            li.setAttribute("icon", sourceData[keys[i]]['icon']);
            li.setAttribute("label", keys[i]);

            li.onmouseover = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "lightblue";

                }

            }

            li.onmouseout = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "";

                }

            }

            li.onclick = function () {

                if (landing.selectedProgram) {

                    if (landing.$(landing.selectedProgram)) {

                        landing.$(landing.selectedProgram).removeAttribute("selected");

                        landing.$(landing.selectedProgram).style.backgroundColor = "";

                        landing.$(landing.selectedProgram).getElementsByTagName("table")[0].style.color = "#000";

                    }

                }

                this.setAttribute("selected", true);

                this.style.backgroundColor = "#345db5";

                this.getElementsByTagName("table")[0].style.color = "#fff";

                landing.selectedProgram = this.id;

                landing.setCookie("currentProgram", this.id, 0.33333, (user.settings.defaultPath ? user.settings.defaultPath : undefined));

                landing.loadModule(this.getAttribute("label"), this.getAttribute("icon"), sourceData[this.getAttribute("label")]);

            }

            ul.appendChild(li);

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.width = "100%";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            li.appendChild(table);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.width = "20px";
            td1.style.textAlign = "right";

            tr.appendChild(td1);

            var img = document.createElement("img");
            img.setAttribute("src", sourceData[keys[i]]['icon']);
            img.height = "45";

            td1.appendChild(img);

            var td2 = document.createElement("td");
            td2.innerHTML = keys[i];

            tr.appendChild(td2);

            if (keys[i] == landing.getCookie("currentProgram")) {

                li.click();

            }

        }

    },

    loadModule: function (module, icon, sourceData) {

        if (landing.$("modApp")) {

            landing.$("modApp").innerHTML = "";

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.style.margin = "auto";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            landing.$("modApp").appendChild(table);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.width = "40px";
            td1.style.textAlign = "right";

            tr.appendChild(td1);

            var img = document.createElement("img");
            img.setAttribute("src", icon);
            img.height = "110";

            td1.appendChild(img);

            var td2 = document.createElement("td");
            td2.innerHTML = module;
            td2.style.fontSize = "30px";
            td2.style.color = "#345db5";

            tr.appendChild(td2);

        }

        if (landing.$("tasks")) {

            landing.$("tasks").innerHTML = "";


            var ul = document.createElement("ul");
            ul.style.listStyle = "none";
            ul.style.width = "100%";
            ul.style.padding = "0px";
            ul.style.margin = "0px";

            landing.$("tasks").appendChild(ul);

            var keys = Object.keys(sourceData["tasks"]);

            var roles = (user.getCookie("roles").trim().length > 0 ? JSON.parse(user.getCookie("roles")) : []);

            for (var i = 0; i < keys.length; i++) {

                if (sourceData['admin_only'] && sourceData['admin_only'][keys[i]] && roles.indexOf("Admin") < 0)
                    continue;

                if (sourceData['supervisor_only'] && sourceData['supervisor_only'][keys[i]] && (roles.indexOf("Supervisor") < 0 ||
                    (landing.settings.supervisor ? roles.indexOf(landing.settings.supervisor) : false)))
                    continue;

                var li = document.createElement("li");
                li.innerHTML = keys[i];
                li.style.padding = "10px";
                li.style.paddingTop = "15px";
                li.style.paddingBottom = "15px";
                li.style.cursor = "pointer";
                li.style.marginBottom = "5px";
                li.style.borderBottom = "1px solid #ccc";
                li.setAttribute("path", sourceData["tasks"][keys[i]]);

                li.onmouseover = function () {

                    if (this.getAttribute('selected') == null) {

                        this.style.backgroundColor = "lightblue";

                    }

                }

                li.onmouseout = function () {

                    if (this.getAttribute('selected') == null) {

                        this.style.backgroundColor = "";

                    }

                }

                li.onclick = function () {

                    if (landing.$("header")) {

                        landing.$("header").innerHTML = this.innerHTML;

                    }

                    if (landing.$("visits")) {

                        landing.$("visits").setAttribute("src", this.getAttribute("path"));

                    }

                    if (landing.selectedTask) {

                        if (landing.selectedTask) {

                            landing.selectedTask.removeAttribute("selected");

                            landing.selectedTask.style.backgroundColor = "";

                            landing.selectedTask.style.color = "#000";

                        }

                    }

                    this.setAttribute("selected", true);

                    this.style.backgroundColor = "#345db5";

                    this.style.color = "#fff";

                    landing.selectedTask = this;

                }

                ul.appendChild(li);

            }

        }

        if (landing.$("header")) {

            landing.$("header").innerHTML = module + " Statistics";

        }

        if (landing.$("visits")) {

            var base = landing.settings.basePath;

            var html = "<html><head><base href='" + base + "' /> <link rel='stylesheet' type='text/css' " +
                "href='/touchscreentoolkit/lib/stylesheets/touch-fancy.css' />" +
                "</head><body oncontextmenu='return false;'><style>body{text-align:center;color:#3c60b1;margin:10px;" +
                "font:18px'LucidaGrande',Helvetica," +
                "Arial,sans-serif;-moz-user-select:none;overflow:auto;}.news{background-color:red;}.sports{" +
                "background-color:blue;}.none{background-color:black;}</style>";

            html += "<img src='" + icon + "' height='200' style='margin-top: 5%;' /><br/><h1>" + module +
                " Statistics</h1></body></html>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            if (landing.$("visits")) {

                landing.$("visits").setAttribute("src", page);

            }

        }

    },

    ajaxRequest: function (url, callback) {

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                if (httpRequest.responseText.trim().length > 0) {
                    var result = JSON.parse(httpRequest.responseText);

                    callback(result);

                } else {

                    callback(undefined);

                }

            }

        };
        try {
            httpRequest.timeout = 0;
            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        } catch (e) {
        }

    },

    ajaxPostRequest: function (url, data, callback) {

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                if (httpRequest.responseText.trim().length > 0) {
                    var result = httpRequest.responseText;

                    callback(result);

                } else {

                    callback(undefined);

                }

            }

        };
        try {
            httpRequest.timeout = 0;
            httpRequest.open("POST", url, true);
            httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            httpRequest.send(JSON.stringify(data));
        } catch (e) {
        }

    },

    navPanel: function (path, custom) {

        if (landing.$("landing.navPanel")) {

            document.body.removeChild(landing.$("landing.navPanel"));

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "0px";
            divPanel.style.width = "100%";
            divPanel.style.height = "100%";
            divPanel.style.backgroundColor = "#fff";
            divPanel.id = "landing.navPanel";
            divPanel.style.zIndex = 800;
            divPanel.style.overflow = "hidden";

            document.body.appendChild(divPanel);

            var iframe = document.createElement("iframe");
            iframe.id = "ifrMain";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "1px solid #000";

            divPanel.appendChild(iframe);

            if (!custom) {

                var url = window.location.href.match(/(.+)\/[^\/]+$/);

                // var base = (url ? url[1] : "");

                var base = landing.settings.basePath;

                var html = "<html><head><title></title><base href='" + base + "' /> <script type='text/javascript' language='javascript' " +
                    "src='" + "/modules/protocol_analyzer.js' defer></script><meta http-equiv='content-type' " +
                    "content='text/html;charset=UTF-8'/><script src='/modules/bht-form2js.js'></script><script language='javascript'>tstUsername = '';" +
                    "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
                    "'/'; tt_cancel_show = '/';" +
                    "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
                    "if(window.parent) window.parent.landing.submitData(data); }</script></head><body>";

                html += "<div id='content'></div><script>document.body.oncontextmenu = function () { return false; }</script></body>";

                var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

                iframe.setAttribute("src", page);

                iframe.onload = function () {

                    if (landing.$("ifrMain").contentWindow.protocol)
                        landing.$("ifrMain").contentWindow.protocol.init(path, undefined, undefined, undefined, undefined);

                }

            } else {

                iframe.setAttribute("src", path);

            }

        }

    },

    navContentPanel: function (content) {

        if (landing.$("landing.navPanel")) {

            document.body.removeChild(landing.$("landing.navPanel"));

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "0px";
            divPanel.style.width = "100%";
            divPanel.style.height = "100%";
            divPanel.style.backgroundColor = "#fff";
            divPanel.id = "landing.navPanel";
            divPanel.style.zIndex = 800;

            document.body.appendChild(divPanel);

            var iframe = document.createElement("iframe");
            iframe.id = "ifrMain";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "1px solid #000";

            var url = window.location.href.match(/(.+)\/[^\/]+$/);

            var base = landing.settings.basePath;

            var html = "<html><head><title></title><base href='" + base + "' /> <script type='text/javascript' language='javascript' " +
                "src='" + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js' defer></script><script " +
                "src='/modules/bht-form2js.js'></script><script language='javascript'>tstUsername = '';" +
                "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
                "'javascript:window.parent.landing.unloadChild()'; tt_cancel_show = 'javascript:window.parent.landing.unloadChild()';" +
                "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
                "if(window.parent) window.parent.landing.submitData(data); }</script></head><body>";

            html += "<div id='content'>" + content + "</div></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            iframe.setAttribute("src", page);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

            }

        }

    },

    submitData: function (data) {

        var path = (data.data.path ? String(data.data.path) : null);
        var nextPath = (data.data.nextPath ? String(data.data.nextPath) : null);

        delete data.data.path;

        delete data.data.nextPath;

        if (landing.$("landing.navPanel")) {

            document.body.removeChild(landing.$("landing.navPanel"));

        }

        data.data.token = landing.getCookie("token");

        data.data.program = landing.getCookie("currentProgram");

        if (path) {

            landing.ajaxPostRequest(path, data, function (sid) {

                if (nextPath)
                    window.location = nextPath;

            })

        }

    },

    showMsg: function (msg, topic) {

        if (!topic) {

            topic = "Message";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "rgba(254,254,254,1)";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "#345db5";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset #345db5";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btn = document.createElement("button");
        btn.className = "blue";
        btn.innerHTML = "OK";

        btn.onclick = function () {

            if (landing.$("msg.shield")) {

                document.body.removeChild(landing.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

    },

    showAlertMsg: function (msg, topic) {

        if (!topic) {

            topic = "Alert";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "rgba(254,254,254,1)";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "red";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset red";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btn = document.createElement("button");
        btn.className = "blue";
        btn.innerHTML = "OK";

        btn.onclick = function () {

            if (landing.$("msg.shield")) {

                document.body.removeChild(landing.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

    },

    locationsList: function (target) {

        if (!target)
            return;

        target.innerHTML = "";

        var div0 = document.createElement("div");
        div0.id = "content";

        target.appendChild(div0);

        var table0 = document.createElement("table");
        table0.width = "100%";
        table0.style.margin = "0px";
        table0.cellSpacing = 0;

        div0.appendChild(table0);

        var tr0_0 = document.createElement("tr");

        table0.appendChild(tr0_0);

        var td0_0_0 = document.createElement("td");
        td0_0_0.style.fontSize = "2.3em";
        td0_0_0.style.backgroundColor = "#6281A7";
        td0_0_0.style.color = "#eee";
        td0_0_0.style.padding = "15px";
        td0_0_0.style.textAlign = "center";
        td0_0_0.innerHTML = "Facility Locations";

        tr0_0.appendChild(td0_0_0);

        var tr0_1 = document.createElement("tr");

        table0.appendChild(tr0_1);

        var td0_1_0 = document.createElement("td");
        td0_1_0.style.borderTop = "5px solid #ccc";
        td0_1_0.style.padding = "0px";

        tr0_1.appendChild(td0_1_0);

        var div0_1_0_0 = document.createElement("div");
        div0_1_0_0.id = "landing.content";
        div0_1_0_0.style.height = "calc(100% - 175px)";
        div0_1_0_0.style.backgroundColor = "#fff";
        div0_1_0_0.style.overflow = "auto";
        div0_1_0_0.style.padding = "1px";
        div0_1_0_0.style.textAlign = "center";
        div0_1_0_0.innerHTML = "&nbsp;";

        div0.appendChild(div0_1_0_0);

        var nav = document.createElement("div");
        nav.style.backgroundColor = "#333";
        nav.style.position = "absolute";
        nav.style.width = "100%";
        nav.style.bottom = "0px";
        nav.style.left = "0px";
        nav.style.height = "80px";

        document.body.appendChild(nav);

        var btnFinish = document.createElement("button");
        btnFinish.className = "green";
        btnFinish.style.cssFloat = "right";
        btnFinish.style.margin = "15px";
        btnFinish.style.width = "150px";
        btnFinish.innerHTML = "Finish";

        btnFinish.onclick = function () {

            window.parent.location = (user.settings.defaultPath ? user.settings.defaultPath : "/");

        }

        nav.appendChild(btnFinish);

        var btnAdd = document.createElement("button");
        // btnAdd.className = (landing.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        btnAdd.style.cssFloat = "right";
        btnAdd.style.margin = "15px";
        btnAdd.style.marginRight = "0px";
        btnAdd.innerHTML = "Add Location";

        btnAdd.onclick = function () {

            if (this.className.match(/gray/))
                return;

            window.parent.landing.addLocation();

        }

        nav.appendChild(btnAdd);

        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        landing.loadLocationsList(landing.settings.locationsSearch + landing.getCookie("currentProgram"), div0_1_0_0);

    },

    loadLocationsList: function (path, target) {

        if (!path || !target)
            return;

        landing.ajaxRequest(path, function (data) {

            if (!target)
                return;

            if (!data)
                return;

            target.innerHTML = "";

            var table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.border = 1;
            table.style.borderColor = "#eee";
            table.width = "100%";
            table.cellPadding = "8";

            target.appendChild(table);

            var tr = document.createElement("tr");
            tr.style.backgroundColor = "#999";
            tr.style.color = "#eee";

            table.appendChild(tr);

            var fields = ["", "Name", "Description", "Print", "Edit", "Delete"];
            var colSizes = ["40px", "", "", "80px", "80px", "80px"];

            for (var i = 0; i < fields.length; i++) {

                var th = document.createElement("th");

                if (colSizes[i])
                    th.style.width = colSizes[i];

                th.innerHTML = fields[i];

                tr.appendChild(th);

            }

            for (var i = 0; i < data.length; i++) {

                var tr = document.createElement("tr");

                table.appendChild(tr);

                var td = document.createElement("td");
                td.innerHTML = i + 1;
                td.style.padding = "0.1em";
                td.style.border = "1px solid #e3e3e2";

                tr.appendChild(td);

                var td = document.createElement("td");
                td.style.padding = "0.1em";
                td.style.textAlign = "left";
                td.style.paddingLeft = "10px";
                td.style.border = "1px solid #e3e3e2";
                td.innerHTML = data[i].name;

                tr.appendChild(td);

                var td = document.createElement("td");
                td.style.padding = "0.1em";
                td.style.textAlign = "left";
                td.style.paddingLeft = "10px";
                td.style.border = "1px solid #e3e3e2";
                td.innerHTML = data[i].description;

                tr.appendChild(td);

                var td = document.createElement("td");
                td.style.padding = "0.1em";
                td.style.border = "1px solid #e3e3e2";

                tr.appendChild(td);

                var editPrint = document.createElement("button");
                editPrint.className = "blue";
                editPrint.innerHTML = "Print";
                editPrint.style.width = "60%";
                editPrint.style.minWidth = "100px";
                editPrint.style.minHeight = "30px";
                editPrint.style.fontWeight = "normal";
                editPrint.setAttribute("tag", data[i].name);
                editPrint.setAttribute("onclick", "window.parent.landing.printLabel(this.getAttribute('tag'));");

                td.appendChild(editPrint);

                var td = document.createElement("td");
                td.style.padding = "0.1em";
                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);

                var editBtn = document.createElement("button");
                editBtn.className = "blue";
                editBtn.innerHTML = "Edit";
                editBtn.style.width = "60%";
                editBtn.style.minWidth = "100px";
                editBtn.style.minHeight = "30px";
                editBtn.style.fontWeight = "normal"
                editBtn.setAttribute("onclick", "window.parent.landing.editLocation('" + JSON.stringify({
                        location_id: data[i].location_id,
                        name: data[i].name,
                        description: data[i].description
                    }) + "')");

                td.appendChild(editBtn);

                var td = document.createElement("td");
                td.style.padding = "0.1em";
                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);

                var deleteBtn = document.createElement("button");
                deleteBtn.className = "red";
                deleteBtn.innerHTML = "Delete";
                deleteBtn.style.width = "60%";
                deleteBtn.style.minWidth = "100px";
                deleteBtn.style.minHeight = "30px";
                deleteBtn.style.fontWeight = "normal";
                deleteBtn.setAttribute("onclick", "window.parent.landing.deleteLocation('" + data[i].location_id + "')");

                td.appendChild(deleteBtn);

            }

        })

    },

    printLabel: function (label) {

        var text = "\nN\nq801\nQ329,026\nZT\nB50,180,0,1,5,15,120,N,\"" + label + "\"\nA40,96,0,2,2,2,N,\"" +
            label + "\"\nP1\n";

        var uri = 'data:application/label; charset=utf-8; filename=test.lbl; disposition=inline,' + encodeURIComponent(text);

        var ifrm = document.createElement("iframe");

        ifrm.setAttribute("src", uri);

        document.body.appendChild(ifrm);

        setTimeout(function () {

            document.body.removeChild(ifrm);

            callback();

        }, 100);

    },

    addLocation: function () {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Path": {
                field_type: "hidden",
                id: "data.path",
                value: landing.settings.saveLocationPath
            },
            "Next Path": {
                field_type: "hidden",
                id: "data.nextPath",
                value: "javascript:window.parent.landing.locationsList(window.parent.document.body)"
            },
            "Location Name": {
                field_type: "text",
                id: "data.name"

            },
            "Description": {
                field_type: "text",
                id: "data.description"

            }
        }

        landing.buildFields(fields, table);

        landing.navContentPanel(form.outerHTML);

    },

    editLocation: function (data) {

        var data = JSON.parse(data);

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Path": {
                field_type: "hidden",
                id: "data.path",
                value: landing.settings.updateLocationPath
            },
            "Location ID": {
                field_type: "hidden",
                id: "data.location_id",
                value: data.location_id
            },
            "Next Path": {
                field_type: "hidden",
                id: "data.nextPath",
                value: "javascript:window.parent.landing.locationsList(window.parent.document.body)"
            },
            "Location Name": {
                field_type: "text",
                id: "data.name",
                value: data.name
            },
            "Description": {
                field_type: "text",
                id: "data.description",
                value: data.description
            }
        }

        landing.buildFields(fields, table);

        landing.navContentPanel(form.outerHTML);

    },

    deleteLocation: function (id) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Path": {
                field_type: "hidden",
                id: "data.path",
                value: landing.settings.retireLocationPath
            },
            "Location ID": {
                field_type: "hidden",
                id: "data.location_id",
                value: id
            },
            "Next Path": {
                field_type: "hidden",
                id: "data.nextPath",
                value: "javascript:window.parent.landing.locationsList(window.parent.document.body)"
            },
            "Why are you deleting the location?": {
                field_type: "text",
                id: "data.reason"
            }
        }

        landing.buildFields(fields, table);

        landing.navContentPanel(form.outerHTML);

    },

    buildFields: function (fields, table) {

        var keys = Object.keys(fields);

        for (var i = 0; i < keys.length; i++) {

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var key = keys[i];

            var td1 = document.createElement("td");
            td1.innerHTML = key;

            tr.appendChild(td1);

            var td2 = document.createElement("td");

            tr.appendChild(td2);

            var fieldType = fields[key].field_type;

            switch (fieldType) {

                case "select":

                    var select = document.createElement("select");
                    select.id = fields[key].id;
                    select.name = fields[key].id;
                    select.setAttribute("helpText", key);

                    td2.appendChild(select);

                    if (fields[key].options) {

                        for (var o = 0; o < fields[key].options.length; o++) {

                            var opt = document.createElement("option");
                            opt.innerHTML = fields[key].options[o];

                            select.appendChild(opt);

                        }

                    }

                    var exceptions = ["options", "helpText"]

                    var attrs = Object.keys(fields[key]);

                    for (var a = 0; a < exceptions.length; a++) {

                        if (attrs.indexOf(exceptions[a]) >= 0) {

                            attrs.splice(attrs.indexOf(exceptions[a]), 1);

                        }

                    }

                    if (attrs.length > 0) {

                        for (var a = 0; a < attrs.length; a++) {

                            var attr = attrs[a];

                            select.setAttribute(attr, fields[key][attr]);

                        }

                    }

                    break;

                default:

                    var input = document.createElement("input");
                    input.id = fields[key].id;
                    input.name = fields[key].id;
                    input.setAttribute("helpText", key);

                    if (fields[key].field_type == "hidden") {

                        input.type = "hidden";

                    } else if (fields[key].field_type == "password") {

                        input.type = "password";

                        fields[key].field_type = "text";

                    } else {

                        input.type = "text";

                    }

                    td2.appendChild(input);

                    var elements = Object.keys(fields[key]);

                    elements.splice(elements.indexOf("id"), 1);

                    for (var j = 0; j < elements.length; j++) {

                        input.setAttribute(elements[j], fields[key][elements[j]]);

                    }

            }

        }

    },

    unloadChild: function () {

        if (landing.$("landing.navPanel")) {

            document.body.removeChild(landing.$("landing.navPanel"));

        }

    },

    ajaxAuthPostRequest: function (url, data, callback) {

        if (!patient)
            return callback(undefined);

        var httpRequest = new XMLHttpRequest();
        var auth = landing.makeBaseAuth(patient.settings.ddeUser, patient.settings.ddePassword);

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                if (httpRequest.responseText.trim().length > 0) {
                    var result = httpRequest.responseText;

                    callback(result);

                } else {

                    callback(undefined);

                }

            }

        };

        data.token = patient.getCookie("dde-token");

        try {
            httpRequest.timeout = 0;
            httpRequest.open("POST", url, true);
            httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            httpRequest.setRequestHeader('Authorization', auth);
            httpRequest.send(JSON.stringify(data));
        } catch (e) {
        }

    },

    makeBaseAuth: function (user, pass) {
        var tok = user + ':' + pass;
        var hash = btoa(tok);
        return "Basic " + hash;
    },

    villagesList: function (target) {

        if (!target)
            return;

        target.innerHTML = "";

        var div0 = document.createElement("div");
        div0.id = "content";

        target.appendChild(div0);

        var table0 = document.createElement("table");
        table0.width = "100%";
        table0.style.margin = "0px";
        table0.cellSpacing = 0;

        div0.appendChild(table0);

        var tr0_0 = document.createElement("tr");

        table0.appendChild(tr0_0);

        var td0_0_0 = document.createElement("td");
        td0_0_0.style.fontSize = "2.3em";
        td0_0_0.style.backgroundColor = "#6281A7";
        td0_0_0.style.color = "#eee";
        td0_0_0.style.padding = "15px";
        td0_0_0.style.textAlign = "center";
        td0_0_0.innerHTML = "Villages Management";

        tr0_0.appendChild(td0_0_0);

        var tr0_1 = document.createElement("tr");

        table0.appendChild(tr0_1);

        var td0_1_0 = document.createElement("td");
        td0_1_0.style.borderTop = "5px solid #ccc";
        td0_1_0.style.padding = "0px";

        tr0_1.appendChild(td0_1_0);

        var div0_1_0_0 = document.createElement("div");
        div0_1_0_0.id = "landing.content";
        div0_1_0_0.style.height = "calc(100% - 175px)";
        div0_1_0_0.style.backgroundColor = "#fff";
        div0_1_0_0.style.overflow = "auto";
        div0_1_0_0.style.padding = "1px";
        div0_1_0_0.style.textAlign = "center";
        div0_1_0_0.innerHTML = "&nbsp;";

        div0.appendChild(div0_1_0_0);

        var nav = document.createElement("div");
        nav.style.backgroundColor = "#333";
        nav.style.position = "absolute";
        nav.style.width = "100%";
        nav.style.bottom = "0px";
        nav.style.left = "0px";
        nav.style.height = "80px";

        document.body.appendChild(nav);

        var btnFinish = document.createElement("button");
        btnFinish.className = "green";
        btnFinish.style.cssFloat = "right";
        btnFinish.style.margin = "15px";
        btnFinish.style.width = "150px";
        btnFinish.innerHTML = "Finish";

        btnFinish.onclick = function () {

            window.parent.location = (user.settings.defaultPath ? user.settings.defaultPath : "/");

        }

        nav.appendChild(btnFinish);

        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        landing.loadVillagesList(div0_1_0_0);

    },

    loadVillagesList: function (target) {

        if (!target)
            return;

        target.innerHTML = "";

        var style = this.sheet();
        this.addCSSRule(style, "li", "text-align: left !important");
        this.addCSSRule(style, "li", "padding: 10px !important");
        this.addCSSRule(style, "li", "font-size: 28px !important");
        this.addCSSRule(style, "li", "border-bottom: 1px solid #ccc !important");

        var table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.border = 1;
        table.style.borderColor = "#eee";
        table.width = "100%";
        table.cellPadding = "8";

        target.appendChild(table);

        var tr1 = document.createElement("tr");
        tr1.style.backgroundColor = "#999";
        tr1.style.color = "#eee";

        table.appendChild(tr1);

        var fields = ["District", "T/A", "Village"];
        var colSizes = ["33%", "33%", ""];

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var tr3 = document.createElement("tr");

        table.appendChild(tr3);

        var cells = [
            "district",
            "ta",
            "village"
        ];

        var searchPaths = [
            "/list_districts",
            "/list_tas",
            "/list_villages"
        ];

        var createPaths = [
            "/add_district",
            "/add_ta",
            "/add_village"
        ];

        var depends = [
            [],
            ["txtdistrict"],
            ["txtdistrict", "txtta"]
        ]

        for (var i = 0; i < fields.length; i++) {

            var th = document.createElement("th");

            if (colSizes[i])
                th.style.width = colSizes[i];

            th.innerHTML = fields[i];

            tr1.appendChild(th);

            var td2 = document.createElement("td");
            td2.style.borderColor = "#999";
            td2.style.borderRight = "none";

            tr2.appendChild(td2);

            var td3 = document.createElement("td");
            td3.style.borderColor = "#999";
            td3.style.borderRight = "none";

            tr3.appendChild(td3);

            var div = document.createElement("div");
            div.id = cells[i];
            div.style.height = "calc(100vh - 285px)";
            div.style.overflow = "auto";
            div.style.width = "100%";

            td3.appendChild(div);

            landing.searchWidget("txt" + cells[i], td2, cells[i], searchPaths[i], createPaths[i], depends[i]);

        }

        landing.fetchDistricts("/list_districts?district=", landing.$("district"), "txtdistrict", "ta");

    },

    searchWidget: function (id, target, display, searchUrl, createUrl, depends) {

        if (!id || !target || !searchUrl || !createUrl || !depends)
            return;

        var table = document.createElement("table");
        table.width = "100%";
        table.style.borderCollapse = "collapse";
        table.cellSpacing = 0;
        table.cellPadding = 0;

        target.appendChild(table);

        target.style.padding = "0px";

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.padding = "0px";

        tr.appendChild(td);

        var input = document.createElement("input");
        input.id = id;
        input.type = "text";
        input.style.fontSize = "24px";
        input.style.padding = "10px";
        input.style.width = "95.5%";
        input.style.border = "none";
        input.setAttribute("placeholder", "Touch to enter text");
        input.setAttribute("depends", JSON.stringify(depends));
        input.setAttribute("searchUrl", searchUrl);
        input.setAttribute("display", display);

        input.onmousedown = function () {

            landing.searchPath = this.getAttribute("searchUrl");

            landing.searchDepends = this.getAttribute("depends");

            landing.searchDisplay = this.getAttribute("display");

            landing.floatKeyboard(this, this.id, function (value) {

                switch (landing.searchDisplay) {

                    case "district":

                        landing.fetchDistricts("/list_districts?district=" + value, landing.$("district"), "txtdistrict", "ta");

                        break;

                    case "ta":

                        landing.fetchTA("/list_tas/" + landing.$("txtdistrict").getAttribute("tstValue") + "?ta=" + value,
                            landing.$("ta"), "txtta", "village");

                        break;

                    case "village":

                        landing.fetchVillage("/list_villages/" + landing.$("txtdistrict").getAttribute("tstValue") +
                            "/" + landing.$("txtta").getAttribute("tstValue") + "?village=" + value, landing.$("village"), "txtvillage");

                        break;

                }

            });

        }

        td.appendChild(input);

        var td = document.createElement("td");
        td.style.padding = "0px";
        td.style.width = "60px";
        td.style.cursor = "pointer";
        td.setAttribute("depends", JSON.stringify(depends));
        td.setAttribute("display", display);

        tr.appendChild(td);

        if (!id.match(/district/)) {

            td.onclick = function () {

                switch (this.getAttribute("display")) {

                    case "ta":

                        if (landing.$("txtdistrict").value.trim().length > 0 && landing.$("txtta").value.trim().length > 0) {

                            var url = "/add_ta";

                            var json = {
                                district: landing.$("txtdistrict").getAttribute("tstValue"),
                                ta: landing.$("txtta").value,
                                token: landing.getCookie("token")
                            }

                            var httpRequest = new XMLHttpRequest();

                            httpRequest.onreadystatechange = function () {

                                landing.handleTAs(httpRequest, landing.$("ta"), "txtta", "village");

                            };
                            try {
                                httpRequest.open("POST", url, true);
                                httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                                httpRequest.send(JSON.stringify(json));
                            } catch (e) {
                            }

                        }

                        break;

                    case "village":

                        if (landing.$("txtvillage").value.trim().length > 0 && landing.$("txtta").value.trim().length > 0) {

                            var url = "/add_village";

                            var json = {
                                ta: landing.$("txtta").getAttribute("tstValue"),
                                village: landing.$("txtvillage").value,
                                token: landing.getCookie("token")
                            }

                            var httpRequest = new XMLHttpRequest();

                            httpRequest.onreadystatechange = function () {

                                landing.handleVillages(httpRequest, landing.$("village"), "txtvillage");

                            };
                            try {
                                httpRequest.open("POST", url, true);
                                httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                                httpRequest.send(JSON.stringify(json));
                            } catch (e) {
                            }

                        }

                        break;

                }

            }

            var img = document.createElement("img");
            img.src = "/images/add.png";

            td.appendChild(img);

        }

    },

    fetchDistricts: function (url, target, txtDistrict, taList) {

        if (!url || !target)
            return;

        target.innerHTML = "";

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                if (httpRequest.responseText.trim().length > 0) {
                    var result = httpRequest.responseText;

                    var ul = document.createElement("ul");
                    ul.style.listStyle = "none";
                    ul.style.padding = "0px";

                    target.appendChild(ul);

                    ul.innerHTML = result;

                    if (landing.$("ta"))
                        landing.$("ta").innerHTML = "";

                    if (landing.$("txtta"))
                        landing.$("txtta").value = "";

                    if (landing.$("village"))
                        landing.$("village").innerHTML = "";

                    if (landing.$("txtvillage"))
                        landing.$("txtvillage").value = "";

                    var lis = ul.getElementsByTagName("li");

                    for (var i = 0; i < lis.length; i++) {

                        lis[i].setAttribute("districtCtrl", txtDistrict);
                        lis[i].setAttribute("taCtrl", taList);

                        lis[i].onmousedown = function () {

                            if (landing.$(this.getAttribute("districtCtrl"))) {

                                landing.$(this.getAttribute("districtCtrl")).value = this.innerHTML;

                                landing.$(this.getAttribute("districtCtrl")).setAttribute("tstValue", this.getAttribute("value"));

                            }

                            landing.$("txtta").value = "";

                            landing.$("txtvillage").value = "";

                            landing.$("village").innerHTML = "";

                            landing.fetchTA("/list_tas/" + this.getAttribute("value"), landing.$("ta"), "txtta", "village");

                            landing.hideKeyboard();

                        }

                    }

                }

            }

        };
        try {
            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        } catch (e) {
        }

    },

    handleTAs: function (httpRequest, target, txtTa, vgeList) {

        target.innerHTML = "";

        if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
            httpRequest.status == 304)) {

            if (httpRequest.responseText.trim().length > 0) {
                var result = httpRequest.responseText;

                var ul = document.createElement("ul");
                ul.style.listStyle = "none";
                ul.style.padding = "0px";

                target.appendChild(ul);

                ul.innerHTML = result;

                if (landing.$("village"))
                    landing.$("village").innerHTML = "";

                if (landing.$("txtvillage"))
                    landing.$("txtvillage").value = "";

                var lis = ul.getElementsByTagName("li");

                for (var i = 0; i < lis.length; i++) {

                    lis[i].setAttribute("taCtrl", txtTa);
                    lis[i].setAttribute("villageCtrl", vgeList);

                    lis[i].onmousedown = function () {

                        if (landing.$(this.getAttribute("taCtrl"))) {

                            landing.$(this.getAttribute("taCtrl")).value = this.innerHTML;

                            landing.$(this.getAttribute("taCtrl")).setAttribute("tstValue", this.getAttribute("value"));

                        }

                        landing.$("txtvillage").value = "";

                        landing.fetchVillage("/list_villages/" + landing.$("txtdistrict").getAttribute("tstValue") +
                            "/" + this.getAttribute("value"), landing.$("village"), "txtvillage");

                        landing.hideKeyboard();

                    }

                }

            }

        }

    },

    fetchTA: function (url, target, txtTa, vgeList) {

        if (!url || !target)
            return;

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            landing.handleTAs(httpRequest, target, txtTa, vgeList);

        };
        try {
            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        } catch (e) {
        }

    },

    handleVillages: function (httpRequest, target, txtVillage) {

        target.innerHTML = "";

        if (httpRequest.responseText.trim().length > 0) {
            var result = httpRequest.responseText;

            var ul = document.createElement("ul");
            ul.style.listStyle = "none";
            ul.style.padding = "0px";

            target.appendChild(ul);

            ul.innerHTML = result;

            var lis = ul.getElementsByTagName("li");

            for (var i = 0; i < lis.length; i++) {

                lis[i].setAttribute("vgeCtrl", txtVillage);

                lis[i].onmousedown = function () {

                    if (landing.$(this.getAttribute("vgeCtrl"))) {

                        landing.$(this.getAttribute("vgeCtrl")).value = this.innerHTML;

                        landing.$(this.getAttribute("vgeCtrl")).setAttribute("tstValue", this.getAttribute("value"));

                    }

                    landing.hideKeyboard();

                }

            }

        }

    },

    fetchVillage: function (url, target, txtVillage) {

        if (!url || !target)
            return;

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                landing.handleVillages(httpRequest, target, txtVillage);

            }

        };
        try {
            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        } catch (e) {
        }

    },

    searchPath: null,

    searchDepends: [],

    searchDisplay: null,

    checkCtrl: function (obj) {

        if (obj == null) {
            return [null, null, null, null];
        }

        var o = obj;
        var t = o.offsetTop;
        var l = o.offsetLeft + 1;
        var w = o.offsetWidth;
        var h = o.offsetHeight;

        while ((o ? (o.offsetParent != document.body) : false)) {
            o = o.offsetParent;
            t += (o ? o.offsetTop : 0);
            l += (o ? o.offsetLeft : 0);
        }
        return [w, h, t, l];

    },

    hideKeyboard: function () {

        if (this.$("popup")) {

            document.body.removeChild(this.$("popup"));

        }

    },

    floatKeyboard: function (ctrl, global_control, listener) {

        if (this.$("popup")) {

            document.body.removeChild(this.$("popup"));

            return;

        }

        var pos = this.checkCtrl(ctrl);

        var popup = document.createElement("div");
        popup.id = "popup";
        popup.style.position = "absolute";
        // popup.style.top = (pos[1] + pos[2] + 5) + "px";
        popup.style.bottom = "90px";
        popup.style.backgroundColor = "rgba(255,255,255,0.99)";
        popup.style.border = "1px solid #ccc";
        popup.style.boxShadow = "10px 10px 5px #888888";
        popup.style.left = ((pos[3] + 614) > window.innerWidth ? ( pos[3] - (614 - pos[0] - 45)) : pos[3]) + "px";
        popup.style.overflow = "hidden";
        popup.style.border = "1px solid #3c60b1";
        popup.style.zIndex = 1000;

        document.body.appendChild(popup);

        var full_keyboard = "full";

        var div = document.createElement("div");
        div.id = "divMenu";
        div.style.backgroundColor = "#EEEEEE";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.margin = "5px";

        popup.appendChild(div);

        var row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
        var row2 = ["", "A", "S", "D", "F", "G", "H", "J", "K", "L"];
        var row3 = ["clear", "Z", "X", "C", "V", "B", "N", "M", "'"];
        var row5 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        var row4 = ["delete", "space", "close"];

        var tbl = document.createElement("table");
        tbl.bgColor = "#fff";
        tbl.cellSpacing = 2;
        tbl.cellPadding = 10;
        tbl.id = "tblKeyboard";
        tbl.width = "100%";

        div.appendChild(tbl);

        var tr5 = document.createElement("tr");

        for (var i = 0; i < row5.length; i++) {

            var td5 = document.createElement("td");
            td5.innerHTML = row5[i];
            td5.align = "center";
            td5.vAlign = "middle";
            td5.style.cursor = "pointer";
            td5.style.fontSize = "1.5em";
            td5.bgColor = "#EEEEEE"
            td5.width = "30px";
            td5.className = "btn";

            td5.onclick = function () {

                if (!this.innerHTML.match(/^$/)) {

                    landing.$(global_control).value += this.innerHTML.toProperCase();
                    landing.$(global_control).value = landing.$(global_control).value.toProperCase();

                    if (listener)
                        listener(landing.$(global_control).value);

                }

            }

            tr5.appendChild(td5);
        }

        if (full_keyboard) {

            tbl.appendChild(tr5);

        }

        var tr1 = document.createElement("tr");

        for (var i = 0; i < row1.length; i++) {

            var td1 = document.createElement("td");
            td1.innerHTML = row1[i];
            td1.align = "center";
            td1.vAlign = "middle";
            td1.style.cursor = "pointer";
            td1.style.fontSize = "1.5em";
            td1.bgColor = "#EEEEEE"
            td1.width = "30px";
            td1.className = "btn";

            td1.onclick = function () {

                if (!this.innerHTML.match(/^$/)) {

                    landing.$(global_control).value += this.innerHTML.toProperCase();
                    landing.$(global_control).value = landing.$(global_control).value.toProperCase();

                    if (listener)
                        listener(landing.$(global_control).value);

                }

            }

            tr1.appendChild(td1);

        }

        tbl.appendChild(tr1);

        var tr2 = document.createElement("tr");

        for (var i = 0; i < row2.length; i++) {

            var td2 = document.createElement("td");
            td2.innerHTML = row2[i];
            td2.align = "center";
            td2.vAlign = "middle";
            td2.style.cursor = "pointer";
            td2.style.fontSize = "1.5em";
            td2.bgColor = "#EEEEEE"
            td2.width = "30px";

            if (!row2[i].trim().match(/^$/)) {

                td2.className = "btn";

            }

            td2.onclick = function () {

                if (!this.innerHTML.match(/^$/)) {

                    landing.$(global_control).value += this.innerHTML.toProperCase();
                    landing.$(global_control).value = landing.$(global_control).value.toProperCase();

                    if (listener)
                        listener(landing.$(global_control).value);

                }

            }

            tr2.appendChild(td2);

        }

        tbl.appendChild(tr2);

        var tr3 = document.createElement("tr");

        tbl.appendChild(tr3);

        for (var i = 0; i < row3.length; i++) {

            var td3 = document.createElement("td");
            td3.innerHTML = row3[i];
            td3.align = "center";
            td3.vAlign = "middle";
            td3.style.cursor = "pointer";
            td3.style.fontSize = "1.5em";
            td3.bgColor = "#EEEEEE"
            td3.width = "30px";

            if (!row3[i].trim().match(/^$/)) {

                td3.className = "btn";

            }

            if (row3[i] == "clear") {

                td3.colSpan = 2;

                td3.onclick = function () {

                    landing.$(global_control).value = "";

                    if (listener)
                        listener(landing.$(global_control).value);

                }

            } else {

                td3.onclick = function () {

                    if (!this.innerHTML.match(/^$/)) {

                        landing.$(global_control).value += this.innerHTML.toProperCase();
                        landing.$(global_control).value = landing.$(global_control).value.toProperCase();

                        if (listener)
                            listener(landing.$(global_control).value);

                    }

                }

            }

            tr3.appendChild(td3);
        }

        var tr4 = document.createElement("tr");

        tbl.appendChild(tr4);

        for (var i = 0; i < row4.length; i++) {

            var td4 = document.createElement("td");
            td4.innerHTML = row4[i];
            td4.align = "center";
            td4.vAlign = "middle";
            td4.style.cursor = "pointer";
            td4.style.fontSize = "1.5em";
            td4.bgColor = "#EEEEEE"
            td4.width = "30px";

            if (!row4[i].trim().match(/^$/)) {

                td4.className = "btn";

                td4.colSpan = 2;

            }

            if (row4[i] == "delete") {

                td4.colSpan = 2;

                td4.onclick = function () {

                    landing.$(global_control).value = landing.$(global_control).value.substring(0, landing.$(global_control).value.length - 1);

                    if (listener)
                        listener(landing.$(global_control).value);

                }

            } else if (row4[i] == "space") {

                td4.colSpan = 6;

                td4.onclick = function () {

                    landing.$(global_control).value += " ";

                    if (listener)
                        listener(landing.$(global_control).value);


                }

            } else if (row4[i] == "close") {

                td4.colSpan = 2;

                td4.onclick = function () {

                    landing.floatKeyboard();

                }

            }

            tr4.appendChild(td4);

        }

    },

    intBarcode: null,

    checkBarcode: function () {

        if (landing.$("barcode")) {

            if (landing.$("barcode").value.trim().match(/\$$/)) {

                if (landing['barcodePath']) {

                    var barcode = landing.$("barcode").value.trim().replace(/\$/g, "");

                    var json = {
                        "npid": barcode,
                        "application": null,
                        "site_code": null,
                        "names": {
                            "family_name": null,
                            "given_name": null,
                            "middle_name": null
                        },
                        "gender": null,
                        "attributes": {
                            "occupation": null,
                            "cell_phone_number": null
                        },
                        "birthdate": null,
                        "patient": {
                            "identifiers": {
                                "other_identifier": null
                            }
                        },
                        "birthdate_estimated": null,
                        "addresses": {
                            "current_residence": null,
                            "current_village": null,
                            "current_ta": null,
                            "current_district": null,
                            "home_village": null,
                            "home_ta": null,
                            "home_district": null
                        },
                        "action": "SEARCH"
                    }

                    if (patient) {

                        landing.ajaxAuthPostRequest(patient.settings.ddePath, json, function (data) {

                            var json = (typeof data == typeof String() ? JSON.parse(data) : data);

                            if (json.length == 1) {

                                var result = JSON.parse(JSON.stringify(json[0]));

                                result.token = patient.getCookie("token");

                                if (patient.modules[patient.getCookie("currentProgram")] &&
                                    patient.modules[patient.getCookie("currentProgram")].clinicPrefix) {

                                    result.prefix = patient.modules[patient.getCookie("currentProgram")].clinicPrefix;

                                    result.createClinicId = true;

                                    result.currentProgram = patient.getCookie("currentProgram");

                                }

                                landing.ajaxPostRequest(patient.settings.afterCreatePath, {data: result}, function (response) {

                                    var npid = JSON.parse(response).npid;

                                    if (result.canPrintBarcode) {

                                        patient.printBarcode(undefined, npid, function () {

                                            if (patient.settings.basePath != undefined) {

                                                window.location = patient.settings.basePath + "/patient/" + npid;

                                            } else {

                                                window.location = (user.settings.defaultPath ? user.settings.defaultPath : "/");

                                            }

                                        })

                                    } else {

                                        if (patient.settings.basePath != undefined) {

                                            window.location = patient.settings.basePath + "/patient/" + npid;

                                        } else {

                                            window.location = (user.settings.defaultPath ? user.settings.defaultPath : "/");

                                        }

                                    }
                                });

                            } else if (json.length > 0) {

                                patient.verifyMatch(json, undefined, true);

                            } else {

                                window.location = landing['barcodePath'] + barcode;

                            }

                        })

                    } else {

                        window.location = landing['barcodePath'] + barcode;

                    }

                } else {

                    landing.$("barcode").value = "";

                    landing.$("barcode").focus();

                    this.intBarcode = setTimeout(function () {

                        landing.checkBarcode();

                    }, 200);

                }

            } else {

                landing.$("barcode").focus();

                this.intBarcode = setTimeout(function () {

                    landing.checkBarcode();

                }, 200);

            }

        } else {

            this.intBarcode = setTimeout(function () {

                landing.checkBarcode();

            }, 200);

        }

    },

    init: function (settingsPath) {

        this['icoBarcode'] = "data:image/png;base64,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";

        this['selectedProgram'] = null;

        this['selectedTask'] = null;

        this['step'] = 5;

        document.body.oncontextmenu = function () {
            return false;
        }

        this.ajaxRequest(settingsPath, function (data) {

            landing['settings'] = data;

            landing['barcodePath'] = landing.settings.barcodePath;

            landing.ajaxRequest(landing.settings.modulesPath, function (modules) {

                landing['modules'] = modules;

                landing.buildPage(function () {

                    landing.ajaxRequest(landing.settings.facilityPath, function (response) {

                        if (landing.$("facility")) {

                            landing.$("facility").innerHTML = response.facility;

                        }

                    });

                });

                setInterval(function () {

                    if (landing.$("main")) {

                        landing.$("main").style.height = (window.innerHeight - 225) + "px";

                    }

                    if (landing.$("details")) {
                        landing.$("details").style.height = (window.innerHeight - 270) + "px";
                    }

                    if (landing.$("programs")) {
                        landing.$("programs").style.height = (window.innerHeight - 270) + "px";
                    }

                    if (landing.$("visits")) {
                        landing.$("visits").style.height = (window.innerHeight - 270) + "px";
                    }

                    if (landing.$("tasks")) {
                        landing.$("tasks").style.height = (window.innerHeight - 270) + "px";
                    }

                }, 10);

            });

        });

        this.intBarcode = setTimeout(function () {

            landing.checkBarcode();

        }, 200);

    }

});

var imported = document.createElement('script');
// imported.src = '/modules/bhtKB.js';
document.head.appendChild(imported);

