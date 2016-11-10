function StringBuffer() {
    this.buffer = [];
}

function Utf8EncodeEnumerator(a) {
    this._input = a;
    this._index = -1;
    this._buffer = [];
}

function Base64DecodeEnumerator(a) {
    this._input = a;
    this._index = -1;
    this._buffer = [];
}

!function(a) {
    var b = function(b, d) {
        this.element = a(b);
        this.format = c.parseFormat(d.format || this.element.data("date-format") || "mm/dd/yyyy");
        this.picker = a(c.template).appendTo("body").on({
            click: a.proxy(this.click, this)
        });
        this.isInput = this.element.is("input");
        this.component = this.element.is(".date") ? this.element.find(".add-on") : false;
        if (this.isInput) this.element.on({
            focus: a.proxy(this.show, this),
            keyup: a.proxy(this.update, this)
        }); else if (this.component) this.component.on("click", a.proxy(this.show, this)); else this.element.on("click", a.proxy(this.show, this));
        this.minViewMode = d.minViewMode || this.element.data("date-minviewmode") || 0;
        if ("string" === typeof this.minViewMode) switch (this.minViewMode) {
          case "months":
            this.minViewMode = 1;
            break;

          case "years":
            this.minViewMode = 2;
            break;

          default:
            this.minViewMode = 0;
        }
        this.viewMode = d.viewMode || this.element.data("date-viewmode") || 0;
        if ("string" === typeof this.viewMode) switch (this.viewMode) {
          case "months":
            this.viewMode = 1;
            break;

          case "years":
            this.viewMode = 2;
            break;

          default:
            this.viewMode = 0;
        }
        this.startViewMode = this.viewMode;
        this.weekStart = d.weekStart || this.element.data("date-weekstart") || 0;
        this.weekEnd = 0 === this.weekStart ? 6 : this.weekStart - 1;
        this.onRender = d.onRender;
        this.fillDow();
        this.fillMonths();
        this.update();
        this.showMode();
    };
    b.prototype = {
        constructor: b,
        show: function(b) {
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.place();
            a(window).on("resize", a.proxy(this.place, this));
            if (b) {
                b.stopPropagation();
                b.preventDefault();
            }
            if (!this.isInput) ;
            var c = this;
            a(document).on("mousedown", function(b) {
                if (0 == a(b.target).closest(".datepicker").length) c.hide();
            });
            this.element.trigger({
                type: "show",
                date: this.date
            });
        },
        hide: function() {
            this.picker.hide();
            a(window).off("resize", this.place);
            this.viewMode = this.startViewMode;
            this.showMode();
            if (!this.isInput) a(document).off("mousedown", this.hide);
            this.element.trigger({
                type: "hide",
                date: this.date
            });
        },
        set: function() {
            var a = c.formatDate(this.date, this.format);
            if (!this.isInput) {
                if (this.component) this.element.find("input").prop("value", a);
                this.element.data("date", a);
            } else this.element.prop("value", a);
        },
        setValue: function(a) {
            if ("string" === typeof a) this.date = c.parseDate(a, this.format); else this.date = new Date(a);
            this.set();
            this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
            this.fill();
        },
        place: function() {
            var a = this.component ? this.component.offset() : this.element.offset();
            this.picker.css({
                top: a.top + this.height,
                left: a.left
            });
        },
        update: function(a) {
            this.date = c.parseDate("string" === typeof a ? a : this.isInput ? this.element.prop("value") : this.element.data("date"), this.format);
            this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
            this.fill();
        },
        fillDow: function() {
            var a = this.weekStart;
            var b = "<tr>";
            while (a < this.weekStart + 7) b += '<th class="dow">' + c.dates.daysMin[a++ % 7] + "</th>";
            b += "</tr>";
            this.picker.find(".datepicker-days thead").append(b);
        },
        fillMonths: function() {
            var a = "";
            var b = 0;
            while (b < 12) a += '<span class="month">' + c.dates.monthsShort[b++] + "</span>";
            this.picker.find(".datepicker-months td").append(a);
        },
        fill: function() {
            var a = new Date(this.viewDate), b = a.getFullYear(), d = a.getMonth(), e = this.date.valueOf();
            this.picker.find(".datepicker-days th:eq(1)").text(c.dates.months[d] + " " + b);
            var f = new Date(b, d - 1, 28, 0, 0, 0, 0), g = c.getDaysInMonth(f.getFullYear(), f.getMonth());
            f.setDate(g);
            f.setDate(g - (f.getDay() - this.weekStart + 7) % 7);
            var h = new Date(f);
            h.setDate(h.getDate() + 42);
            h = h.valueOf();
            var i = [];
            var j, k, l;
            while (f.valueOf() < h) {
                if (f.getDay() === this.weekStart) i.push("<tr>");
                j = this.onRender(f);
                k = f.getFullYear();
                l = f.getMonth();
                if (l < d && k === b || k < b) j += " old"; else if (l > d && k === b || k > b) j += " new";
                if (f.valueOf() === e) j += " active";
                i.push('<td class="day ' + j + '">' + f.getDate() + "</td>");
                if (f.getDay() === this.weekEnd) i.push("</tr>");
                f.setDate(f.getDate() + 1);
            }
            this.picker.find(".datepicker-days tbody").empty().append(i.join(""));
            var m = this.date.getFullYear();
            var n = this.picker.find(".datepicker-months").find("th:eq(1)").text(b).end().find("span").removeClass("active");
            if (m === b) n.eq(this.date.getMonth()).addClass("active");
            i = "";
            b = 10 * parseInt(b / 10, 10);
            var o = this.picker.find(".datepicker-years").find("th:eq(1)").text(b + "-" + (b + 9)).end().find("td");
            b -= 1;
            for (var p = -1; p < 11; p++) {
                i += '<span class="year' + (p === -1 || 10 === p ? " old" : "") + (m === b ? " active" : "") + '">' + b + "</span>";
                b += 1;
            }
            o.html(i);
        },
        click: function(b) {
            b.stopPropagation();
            b.preventDefault();
            var d = a(b.target).closest("span, td, th");
            if (1 === d.length) switch (d[0].nodeName.toLowerCase()) {
              case "th":
                switch (d[0].className) {
                  case "switch":
                    this.showMode(1);
                    break;

                  case "prev":
                  case "next":
                    this.viewDate["set" + c.modes[this.viewMode].navFnc].call(this.viewDate, this.viewDate["get" + c.modes[this.viewMode].navFnc].call(this.viewDate) + c.modes[this.viewMode].navStep * ("prev" === d[0].className ? -1 : 1));
                    this.fill();
                    this.set();
                }
                break;

              case "span":
                if (d.is(".month")) {
                    var e = d.parent().find("span").index(d);
                    this.viewDate.setMonth(e);
                } else {
                    var f = parseInt(d.text(), 10) || 0;
                    this.viewDate.setFullYear(f);
                }
                if (0 !== this.viewMode) {
                    this.date = new Date(this.viewDate);
                    this.element.trigger({
                        type: "changeDate",
                        date: this.date,
                        viewMode: c.modes[this.viewMode].clsName
                    });
                }
                this.showMode(-1);
                this.fill();
                this.set();
                break;

              case "td":
                if (d.is(".day") && !d.is(".disabled")) {
                    var g = parseInt(d.text(), 10) || 1;
                    var e = this.viewDate.getMonth();
                    if (d.is(".old")) e -= 1; else if (d.is(".new")) e += 1;
                    var f = this.viewDate.getFullYear();
                    this.date = new Date(f, e, g, 0, 0, 0, 0);
                    this.viewDate = new Date(f, e, Math.min(28, g), 0, 0, 0, 0);
                    this.fill();
                    this.set();
                    this.element.trigger({
                        type: "changeDate",
                        date: this.date,
                        viewMode: c.modes[this.viewMode].clsName
                    });
                }
            }
        },
        mousedown: function(a) {
            a.stopPropagation();
            a.preventDefault();
        },
        showMode: function(a) {
            if (a) this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + a));
            this.picker.find(">div").hide().filter(".datepicker-" + c.modes[this.viewMode].clsName).show();
        }
    };
    a.fn.datepicker = function(c, d) {
        return this.each(function() {
            var e = a(this), f = e.data("datepicker"), g = "object" === typeof c && c;
            if (!f) e.data("datepicker", f = new b(this, a.extend({}, a.fn.datepicker.defaults, g)));
            if ("string" === typeof c) f[c](d);
        });
    };
    a.fn.datepicker.defaults = {
        onRender: function(a) {
            return "";
        }
    };
    a.fn.datepicker.Constructor = b;
    var c = {
        modes: [ {
            clsName: "days",
            navFnc: "Month",
            navStep: 1
        }, {
            clsName: "months",
            navFnc: "FullYear",
            navStep: 1
        }, {
            clsName: "years",
            navFnc: "FullYear",
            navStep: 10
        } ],
        dates: {
            days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ],
            daysShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
            daysMin: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su" ],
            months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            monthsShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        },
        isLeapYear: function(a) {
            return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0;
        },
        getDaysInMonth: function(a, b) {
            return [ 31, c.isLeapYear(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][b];
        },
        parseFormat: function(a) {
            var b = a.match(/[.\/\-\s].*?/), c = a.split(/\W+/);
            if (!b || !c || 0 === c.length) throw new Error("Invalid date format.");
            return {
                separator: b,
                parts: c
            };
        },
        parseDate: function(a, b) {
            var c = a.split(b.separator), a = new Date(), d;
            a.setHours(0);
            a.setMinutes(0);
            a.setSeconds(0);
            a.setMilliseconds(0);
            if (c.length === b.parts.length) {
                var e = a.getFullYear(), f = a.getDate(), g = a.getMonth();
                for (var h = 0, i = b.parts.length; h < i; h++) {
                    d = parseInt(c[h], 10) || 1;
                    switch (b.parts[h]) {
                      case "dd":
                      case "d":
                        f = d;
                        a.setDate(d);
                        break;

                      case "mm":
                      case "m":
                        g = d - 1;
                        a.setMonth(d - 1);
                        break;

                      case "yy":
                        e = 2e3 + d;
                        a.setFullYear(2e3 + d);
                        break;

                      case "yyyy":
                        e = d;
                        a.setFullYear(d);
                    }
                }
                a = new Date(e, g, f, 0, 0, 0);
            }
            return a;
        },
        formatDate: function(a, b) {
            var c = {
                d: a.getDate(),
                m: a.getMonth() + 1,
                yy: a.getFullYear().toString().substring(2),
                yyyy: a.getFullYear()
            };
            c.dd = (c.d < 10 ? "0" : "") + c.d;
            c.mm = (c.m < 10 ? "0" : "") + c.m;
            var a = [];
            for (var d = 0, e = b.parts.length; d < e; d++) a.push(c[b.parts[d]]);
            return a.join(b.separator);
        },
        headTemplate: "<thead>" + "<tr>" + '<th class="prev">&lsaquo;</th>' + '<th colspan="5" class="switch"></th>' + '<th class="next">&rsaquo;</th>' + "</tr>" + "</thead>",
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };
    c.template = '<div class="datepicker dropdown-menu">' + '<div class="datepicker-days">' + '<table class=" table-condensed">' + c.headTemplate + "<tbody></tbody>" + "</table>" + "</div>" + '<div class="datepicker-months">' + '<table class="table-condensed">' + c.headTemplate + c.contTemplate + "</table>" + "</div>" + '<div class="datepicker-years">' + '<table class="table-condensed">' + c.headTemplate + c.contTemplate + "</table>" + "</div>" + "</div>";
}(window.jQuery);

StringBuffer.prototype.append = function(a) {
    this.buffer.push(a);
    return this;
};

StringBuffer.prototype.toString = function a() {
    return this.buffer.join("");
};

var Base64 = {
    codex: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(a) {
        var b = new StringBuffer();
        var c = new Utf8EncodeEnumerator(a);
        while (c.moveNext()) {
            var d = c.current;
            c.moveNext();
            var e = c.current;
            c.moveNext();
            var f = c.current;
            var g = d >> 2;
            var h = (3 & d) << 4 | e >> 4;
            var i = (15 & e) << 2 | f >> 6;
            var j = 63 & f;
            if (isNaN(e)) i = j = 64; else if (isNaN(f)) j = 64;
            b.append(this.codex.charAt(g) + this.codex.charAt(h) + this.codex.charAt(i) + this.codex.charAt(j));
        }
        return b.toString();
    },
    decode: function(a) {
        var b = new StringBuffer();
        var c = new Base64DecodeEnumerator(a);
        while (c.moveNext()) {
            var d = c.current;
            if (d < 128) b.append(String.fromCharCode(d)); else if (d > 191 && d < 224) {
                c.moveNext();
                var e = c.current;
                b.append(String.fromCharCode((31 & d) << 6 | 63 & e));
            } else {
                c.moveNext();
                var e = c.current;
                c.moveNext();
                var f = c.current;
                b.append(String.fromCharCode((15 & d) << 12 | (63 & e) << 6 | 63 & f));
            }
        }
        return b.toString();
    }
};

Utf8EncodeEnumerator.prototype = {
    current: Number.NaN,
    moveNext: function() {
        if (this._buffer.length > 0) {
            this.current = this._buffer.shift();
            return true;
        } else if (this._index >= this._input.length - 1) {
            this.current = Number.NaN;
            return false;
        } else {
            var a = this._input.charCodeAt(++this._index);
            if (13 == a && 10 == this._input.charCodeAt(this._index + 1)) {
                a = 10;
                this._index += 2;
            }
            if (a < 128) this.current = a; else if (a > 127 && a < 2048) {
                this.current = a >> 6 | 192;
                this._buffer.push(63 & a | 128);
            } else {
                this.current = a >> 12 | 224;
                this._buffer.push(a >> 6 & 63 | 128);
                this._buffer.push(63 & a | 128);
            }
            return true;
        }
    }
};

Base64DecodeEnumerator.prototype = {
    current: 64,
    moveNext: function() {
        if (this._buffer.length > 0) {
            this.current = this._buffer.shift();
            return true;
        } else if (this._index >= this._input.length - 1) {
            this.current = 64;
            return false;
        } else {
            var a = Base64.codex.indexOf(this._input.charAt(++this._index));
            var b = Base64.codex.indexOf(this._input.charAt(++this._index));
            var c = Base64.codex.indexOf(this._input.charAt(++this._index));
            var d = Base64.codex.indexOf(this._input.charAt(++this._index));
            var e = a << 2 | b >> 4;
            var f = (15 & b) << 4 | c >> 2;
            var g = (3 & c) << 6 | d;
            this.current = e;
            if (64 != c) this._buffer.push(f);
            if (64 != d) this._buffer.push(g);
            return true;
        }
    }
};