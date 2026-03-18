var ClickableMap = {};

(function () {
    var version = "1.0.0";
    var classPrefix = "cmm-usa-";
    var creditLinkUrl = "https://www.clickablemapmaker.com";
    var stateCount = 0;
    var maxTableColumns = 5;
    var global = this;

    this.getEleById = function (id) {
        return document.getElementById(id);
    };

    this.getEleByQuery = function (query) {
        return document.querySelector(query);
    };

    this.stateIdToDomClass = function (stateId) {
        return classPrefix + "state-" + stateId.toLowerCase();
    };

    this.version = version;

    function createBaseGlobalData() {
        return {
            version: version,
            width: "100",
            widthUnits: "%",
            fontSize: "12px",
            fontName: "Arial",
            fill: "#0d14f8",
            hoverFill: "#ffffff",
            disabledFill: "#c2c2c2",
            backgroundFill: "#ffffff",
            innerLabelColor: "#000000",
            outerLabelColor: "#000000",
            hoverLabelColor: "#d64933",
            borderType: null,
            borderStroke: "#000000",
            enableShadows: true,
            popLink: false,
            showStateTitleAndDescOnHover: true,
            showLinksList: false,
            globalLinkUrl: null,
            globalJsCallback: null,
            mapTitle: "Choose your state below",
            creditLink: ""
        };
    }

    function createBaseStatesData() {
        var statesData = {
            AL: { fullName: "Alabama" },
            AK: { fullName: "Alaska" },
            AZ: { fullName: "Arizona" },
            AR: { fullName: "Arkansas" },
            CA: { fullName: "California" },
            CO: { fullName: "Colorado" },
            CT: { fullName: "Connecticut" },
            DE: { fullName: "Delaware" },
            DC: { fullName: "District Of Columbia" },
            FL: { fullName: "Florida" },
            GA: { fullName: "Georgia" },
            HI: { fullName: "Hawaii" },
            ID: { fullName: "Idaho" },
            IL: { fullName: "Illinois" },
            IN: { fullName: "Indiana" },
            IA: { fullName: "Iowa" },
            KS: { fullName: "Kansas" },
            KY: { fullName: "Kentucky" },
            LA: { fullName: "Louisiana" },
            ME: { fullName: "Maine" },
            MD: { fullName: "Maryland" },
            MA: { fullName: "Massachusetts" },
            MI: { fullName: "Michigan" },
            MN: { fullName: "Minnesota" },
            MS: { fullName: "Mississippi" },
            MO: { fullName: "Missouri" },
            MT: { fullName: "Montana" },
            NE: { fullName: "Nebraska" },
            NV: { fullName: "Nevada" },
            NH: { fullName: "New Hampshire" },
            NJ: { fullName: "New Jersey" },
            NM: { fullName: "New Mexico" },
            NY: { fullName: "New York" },
            NC: { fullName: "North Carolina" },
            ND: { fullName: "North Dakota" },
            OH: { fullName: "Ohio" },
            OK: { fullName: "Oklahoma" },
            OR: { fullName: "Oregon" },
            PA: { fullName: "Pennsylvania" },
            RI: { fullName: "Rhode Island" },
            SC: { fullName: "South Carolina" },
            SD: { fullName: "South Dakota" },
            TN: { fullName: "Tennessee" },
            TX: { fullName: "Texas" },
            UT: { fullName: "Utah" },
            VT: { fullName: "Vermont" },
            VA: { fullName: "Virginia" },
            WA: { fullName: "Washington" },
            WV: { fullName: "West Virginia" },
            WI: { fullName: "Wisconsin" },
            WY: { fullName: "Wyoming" }
        };

        for (var stateId in statesData) {
            if (!statesData.hasOwnProperty(stateId)) continue;
            statesData[stateId].title = statesData[stateId].fullName;
            statesData[stateId].description = null;
            statesData[stateId].longDescription = null;
            statesData[stateId].linkUrl = null;
            statesData[stateId].isDisabled = false;
            statesData[stateId].isHovering = false;
            statesData[stateId].cssClass = null;
            statesData[stateId].overrideFill = null;
            statesData[stateId].overrideFillEnabled = false;
            statesData[stateId].overrideHoverFill = null;
            statesData[stateId].overrideHoverFillEnabled = false;
            statesData[stateId].overridePopLink = null;
            stateCount++;
        }

        return statesData;
    }

    function stateOn(stateId) {
        if (this.statesData[stateId].isHovering) return;
        this.statesData[stateId].isHovering = true;

        var $stateLink = global.getEleByQuery("#" + this.$map.id + " ." + global.stateIdToDomClass(stateId));
        var $statePath = global.getEleByQuery("#" + this.$map.id + " ." + global.stateIdToDomClass(stateId) + " path");
        var $stateText = global.getEleByQuery("#" + this.$map.id + " ." + global.stateIdToDomClass(stateId) + " text");

        if (this.statesData[stateId].isDisabled) {
            $statePath.style.fill = this.globalData.disabledFill;
            $stateLink.style.cursor = "default";
        } else if (
            this.statesData[stateId].overrideHoverFillEnabled &&
            this.statesData[stateId].overrideHoverFill != null
        ) {
            $statePath.style.fill = this.statesData[stateId].overrideHoverFill;
            $stateText.style.fill = this.globalData.hoverLabelColor;
            $stateLink.style.cursor = "pointer";
        } else {
            $statePath.style.fill = this.globalData.hoverFill;
            $stateText.style.fill = this.globalData.hoverLabelColor;
            $stateLink.style.cursor = "pointer";
        }

        if (this.globalData.showStateTitleAndDescOnHover) {
            var $hoverStateInfo = global.getEleByQuery("#" + this.$map.id + " ." + classPrefix + "hover-state-info");
            var titleText = this.statesData[stateId].title == null ? "" : this.statesData[stateId].title;
            var descText = this.statesData[stateId].description == null ? "" : this.statesData[stateId].description;
            var longDescText = this.statesData[stateId].longDescription == null ? "" : this.statesData[stateId].longDescription;

            var titleSpan = document.createElement("span");
            var descSpan = document.createElement("span");

            titleSpan.textContent = titleText;
            if (longDescText !== "") {
                descSpan.innerHTML = longDescText;
            } else {
                descSpan.textContent = descText;
            }

            while ($hoverStateInfo.firstChild) {
                $hoverStateInfo.removeChild($hoverStateInfo.firstChild);
            }

            $hoverStateInfo.appendChild(titleSpan);
            $hoverStateInfo.appendChild(descSpan);
            $hoverStateInfo.style.display = "block";
        }

        if (!this.statesData[stateId].isDisabled && this.globalData.enableShadows) {
            var statePathBlur = $statePath.cloneNode(true);
            statePathBlur.setAttribute("filter", "url(#" + this.$map.id + "-blur-filter)");
            statePathBlur.setAttribute("class", classPrefix + "state-shadow");
            $stateLink.parentNode.appendChild(statePathBlur);
            $stateLink.parentNode.appendChild($stateLink);
        }
    }

    function stateOff(stateId) {
        this.statesData[stateId].isHovering = false;

        var $statePath = global.getEleByQuery("#" + this.$map.id + " ." + global.stateIdToDomClass(stateId) + " path");
        var $stateText = global.getEleByQuery("#" + this.$map.id + " ." + global.stateIdToDomClass(stateId) + " text");
        var isOuterLabel = $stateText.getAttribute("class") === classPrefix + "outer-label";

        if (this.globalData.showStateTitleAndDescOnHover) {
            var $hoverStateInfo = global.getEleByQuery("#" + this.$map.id + " ." + classPrefix + "hover-state-info");
            $hoverStateInfo.style.display = "none";
        }

        if (this.statesData[stateId].isDisabled) {
            $statePath.style.fill = this.globalData.disabledFill;
        } else if (this.statesData[stateId].overrideFillEnabled && this.statesData[stateId].overrideFill != null) {
            $statePath.style.fill = this.statesData[stateId].overrideFill;
            $stateText.style.fill = isOuterLabel ? this.globalData.outerLabelColor : this.globalData.innerLabelColor;
        } else {
            $statePath.style.fill = this.globalData.fill;
            $stateText.style.fill = isOuterLabel ? this.globalData.outerLabelColor : this.globalData.innerLabelColor;
        }

        var allShadows = document.querySelectorAll("#" + this.$map.id + " ." + classPrefix + "state-shadow");
        Array.prototype.map.call(Array.prototype.slice.call(allShadows), function (ele) {
            ele.parentNode.removeChild(ele);
        });
    }

    this.create = function (wrapperId) {
        return new this.mapObject(wrapperId);
    };

    this.mapObject = function (wrapperId) {
        this.$map = global.getEleById(wrapperId);
        this.globalData = createBaseGlobalData();
        this.statesData = createBaseStatesData();

        for (var stateId in this.statesData) {
            if (!this.statesData.hasOwnProperty(stateId)) continue;

            (function (stateId) {
                var $stateLink = global.getEleByQuery("#" + this.$map.id + " ." + global.stateIdToDomClass(stateId));
                var self = this;

                if ($stateLink) {
                    $stateLink.addEventListener("mouseover", function () {
                        stateOn.call(self, stateId);
                    });

                    $stateLink.addEventListener("mouseout", function () {
                        stateOff.call(self, stateId);
                    });
                }
            }.call(this, stateId));
        }

        global.getEleByQuery("#" + this.$map.id + " ." + classPrefix + "blur-filter")
            .setAttribute("id", this.$map.id + "-blur-filter");
    };

    this.mapObject.prototype.draw = function () {
        this.$map.style.width = this.globalData.width + this.globalData.widthUnits;
        this.$map.style.backgroundColor = this.globalData.backgroundFill;
        this.$map.style.fontFamily = this.globalData.fontName;
        this.$map.style.fontSize = this.globalData.fontSize;

        global.getEleByQuery("#" + this.$map.id + " ." + classPrefix + "title").textContent = this.globalData.mapTitle;

        if (this.globalData.creditLink) {
            global.getEleByQuery("#" + this.$map.id + " ." + classPrefix + "credit-link").innerHTML =
                '<a target="_blank" href="' + creditLinkUrl + '"></a>';
            global.getEleByQuery("#" + this.$map.id + " ." + classPrefix + "credit-link a").textContent =
                this.globalData.creditLink;
        } else {
            global.getEleByQuery("#" + this.$map.id + " ." + classPrefix + "credit-link").innerHTML = "";
        }

        for (var stateId in this.statesData) {
            if (!this.statesData.hasOwnProperty(stateId)) continue;

            var stateDomClass = global.stateIdToDomClass(stateId);
            var $stateTitle = global.getEleByQuery("#" + this.$map.id + " ." + stateDomClass + " title");
            var $stateDescription = global.getEleByQuery("#" + this.$map.id + " ." + stateDomClass + " desc");
            var $statePath = global.getEleByQuery("#" + this.$map.id + " ." + stateDomClass + " path");

            if (!$statePath) continue;

            if ($stateTitle) $stateTitle.textContent = this.statesData[stateId].title;
            if ($stateDescription) $stateDescription.textContent = this.statesData[stateId].description;

            $statePath.style.stroke = this.globalData.borderStroke;
            $statePath.style.strokeDasharray = this.globalData.borderType != null ? this.globalData.borderType : "none";

            if (this.statesData[stateId].isDisabled) {
                $statePath.style.fill = this.globalData.disabledFill;
            } else if (this.statesData[stateId].overrideFillEnabled && this.statesData[stateId].overrideFill != null) {
                $statePath.style.fill = this.statesData[stateId].overrideFill;
            } else {
                $statePath.style.fill = this.globalData.fill;
            }

            var $allLabels = document.querySelectorAll("#" + this.$map.id + " ." + stateDomClass + " text");
            for (var i = 0; i < $allLabels.length; ++i) {
                $allLabels.item(i).style.fill = this.globalData.innerLabelColor;
            }

            this.wireStateLink(stateId, false);
        }

        var $outerLabels = document.querySelectorAll("#" + this.$map.id + " ." + classPrefix + "outer-label");
        for (var j = 0; j < $outerLabels.length; ++j) {
            $outerLabels.item(j).style.fill = this.globalData.outerLabelColor;
        }

        this.$map.style.display = "block";
    };

    this.mapObject.prototype.setGlobalData = function (data) {
        for (var setting in this.globalData) {
            if (!this.globalData.hasOwnProperty(setting) || !data.hasOwnProperty(setting)) continue;
            this.globalData[setting] = data[setting];
        }
    };

    this.mapObject.prototype.setStatesData = function (data) {
        for (var state in this.statesData) {
            if (!this.statesData.hasOwnProperty(state) || !data.hasOwnProperty(state)) continue;
            for (var setting in this.statesData[state]) {
                if (!this.statesData[state].hasOwnProperty(setting) || !data[state].hasOwnProperty(setting)) continue;
                this.statesData[state][setting] = data[state][setting];
            }
        }
    };

    this.mapObject.prototype.wireStateLink = function (stateId) {
        var clickFn = null;
        var $stateLink = global.getEleByQuery("#" + this.$map.id + " ." + global.stateIdToDomClass(stateId));

        if (!$stateLink) return;

        if (this.statesData[stateId].cssClass != null) {
            $stateLink.setAttribute("class", $stateLink.getAttribute("class") + " " + this.statesData[stateId].cssClass);
        }

        if (this.statesData[stateId].isDisabled) {
            clickFn = null;
        } else if (this.statesData[stateId].linkUrl != null) {
            var self = this;
            clickFn = function () {
                var isPop = false;
                if (self.statesData[stateId].overridePopLink != null) {
                    isPop = self.statesData[stateId].overridePopLink;
                } else if (self.globalData.popLink) {
                    isPop = true;
                }

                if (isPop) {
                    window.open(self.statesData[stateId].linkUrl);
                } else {
                    document.location.href = self.statesData[stateId].linkUrl;
                }
            };
        }

        $stateLink.onclick = clickFn;
    };

    if (typeof exports !== "undefined") {
        module.exports = this;
    }
}).apply(ClickableMap);

/* ===== Map Setup ===== */

var myUsaMap = ClickableMap.create("cmm-usa");

myUsaMap.setGlobalData({
    version: "1.0.0",
    width: "100",
    widthUnits: "%",
    fontSize: "12px",
    fontName: "Arial",
    fill: "#0d14f8",
    hoverFill: "#ffffff",
    disabledFill: "#c2c2c2",
    backgroundFill: "#ffffff",
    innerLabelColor: "#000000",
    outerLabelColor: "#000000",
    hoverLabelColor: "#d64933",
    borderType: null,
    borderStroke: "#000000",
    enableShadows: true,
    popLink: false,
    showStateTitleAndDescOnHover: true,
    showLinksList: false,
    globalLinkUrl: null,
    globalJsCallback: null,
    mapTitle: "Choose your state below",
    creditLink: ""
});

myUsaMap.setStatesData({
    AL: { title: "Alabama", linkUrl: "United%20States/Alabama/index.html", isDisabled: false },
    AK: { title: "Alaska", linkUrl: "United%20States/Alaska/index.html", isDisabled: false },
    AZ: { title: "Arizona", linkUrl: "United%20States/Arizona/index.html", isDisabled: false },
    AR: { title: "Arkansas", linkUrl: "United%20States/Arkansas/index.html", isDisabled: false },
    CA: { title: "California", linkUrl: "United%20States/California/index.html", isDisabled: false },
    CO: { title: "Colorado", linkUrl: "United%20States/Colorado/index.html", isDisabled: false },
    CT: { title: "Connecticut", linkUrl: "United%20States/Connecticut/index.html", isDisabled: false },
    DE: { title: "Delaware", linkUrl: "United%20States/Delaware/index.html", isDisabled: true },
    DC: { title: "District Of Columbia", isDisabled: true },

    FL: { title: "Florida", linkUrl: "United%20States/Florida/index.html", isDisabled: false },
    GA: { title: "Georgia", linkUrl: "United%20States/Georgia/index.html", isDisabled: false },
    HI: { title: "Hawaii", linkUrl: "United%20States/Hawaii/index.html", isDisabled: false },
    ID: { title: "Idaho", linkUrl: "United%20States/Idaho/index.html", isDisabled: false },
    IL: { title: "Illinois", linkUrl: "United%20States/Illinois/index.html", isDisabled: false },
    IN: { title: "Indiana", linkUrl: "United%20States/Indiana/index.html", isDisabled: false },
    IA: { title: "Iowa", linkUrl: "United%20States/Iowa/index.html", isDisabled: false },
    KS: { title: "Kansas", linkUrl: "United%20States/Kansas/index.html", isDisabled: false },
    KY: { title: "Kentucky", linkUrl: "United%20States/Kentucky/index.html", isDisabled: false },
    LA: { title: "Louisiana", linkUrl: "United%20States/Louisiana/index.html", isDisabled: false },

    ME: { title: "Maine", linkUrl: "United%20States/Maine/index.html", isDisabled: false },
    MD: { title: "Maryland", linkUrl: "United%20States/Maryland/index.html", isDisabled: false },
    MA: { title: "Massachusetts", linkUrl: "United%20States/Massachusetts/index.html", isDisabled: false },
    MI: { title: "Michigan", linkUrl: "United%20States/Michigan/index.html", isDisabled: false },
    MN: { title: "Minnesota", linkUrl: "United%20States/Minnesota/index.html", isDisabled: false },
    MS: { title: "Mississippi", linkUrl: "United%20States/Mississippi/index.html", isDisabled: true },
    MO: { title: "Missouri", linkUrl: "United%20States/Missouri/index.html", isDisabled: false },
    MT: { title: "Montana", linkUrl: "United%20States/Montana/index.html", isDisabled: false },

    NE: { title: "Nebraska", linkUrl: "United%20States/Nebraska/index.html", isDisabled: false },
    NV: { title: "Nevada", linkUrl: "United%20States/Nevada/index.html", isDisabled: false },
    NH: { title: "New Hampshire", linkUrl: "United%20States/New%20Hampshire/index.html", isDisabled: true },
    NJ: { title: "New Jersey", linkUrl: "United%20States/New%20Jersey/index.html", isDisabled: false },
    NM: { title: "New Mexico", linkUrl: "United%20States/New%20Mexico/index.html", isDisabled: false },
    NY: { title: "New York", linkUrl: "United%20States/New%20York/index.html", isDisabled: false },

    NC: { title: "North Carolina", linkUrl: "United%20States/North%20Carolina/index.html", isDisabled: false },
    ND: { title: "North Dakota", linkUrl: "United%20States/North%20Dakota/index.html", isDisabled: false },
    OH: { title: "Ohio", linkUrl: "United%20States/Ohio/index.html", isDisabled: false },
    OK: { title: "Oklahoma", linkUrl: "United%20States/Oklahoma/index.html", isDisabled: false },
    OR: { title: "Oregon", linkUrl: "United%20States/Oregon/index.html", isDisabled: false },
    PA: { title: "Pennsylvania", linkUrl: "United%20States/Pennsylvania/index.html", isDisabled: false },

    RI: { title: "Rhode Island", linkUrl: "United%20States/Rhode%20Island/index.html", isDisabled: true },
    SC: { title: "South Carolina", linkUrl: "United%20States/South%20Carolina/index.html", isDisabled: false },
    SD: { title: "South Dakota", linkUrl: "United%20States/South%20Dakota/index.html", isDisabled: false },
    TN: { title: "Tennessee", linkUrl: "United%20States/Tennessee/index.html", isDisabled: false },
    TX: { title: "Texas", linkUrl: "United%20States/Texas/index.html", isDisabled: false },

    UT: { title: "Utah", linkUrl: "United%20States/Utah/index.html", isDisabled: false },
    VT: { title: "Vermont", linkUrl: "United%20States/Vermont/index.html", isDisabled: true },
    VA: { title: "Virginia", linkUrl: "United%20States/Virginia/index.html", isDisabled: false },
    WA: { title: "Washington", linkUrl: "United%20States/Washington/index.html", isDisabled: false },
    WV: { title: "West Virginia", linkUrl: "United%20States/West%20Virginia/index.html", isDisabled: true },
    WI: { title: "Wisconsin", linkUrl: "United%20States/Wisconsin/index.html", isDisabled: false },
    WY: { title: "Wyoming", linkUrl: "United%20States/Wyoming/index.html", isDisabled: false }
});

myUsaMap.draw();