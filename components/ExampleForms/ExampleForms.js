function _ExampleForms (element, parent) {

    VanillaBootComponent.call(this, element, parent);
    
    this.loadDependencies(this, [
        "lib/tippy/popper.min.js",
        "lib/tippy/tippy-bundle.umd.min.js",
        "/components/ExampleForms/ExampleForms.css"
      ]);

    this.tradersPortfoliosAccounts = {};
    this.isAdmin = false;
    this.holidays = [];

    this.previousTrades = {};
    this.gatewayFiles = {};

    function getClientInit ()
    {
        return new Promise ((resolve, reject) => {
            resolve({
                tradersPortfoliosAccounts: {
                    "waldo": {
                        "Waldo": [
                            "XYZ27 Waldo",
                            "XYZ27"
                        ]
                    },
                    "plugh": {
                        "Plugh": [
                            "XYZ02_PLUGH"
                        ]
                    },
                    "bloop": {
                        "Bloop": [
                            "XYZ06_BLOOP"
                        ],
                        "Fred": [
                            "XYZ13_FRED",
                            "XYZ29 Fred",
                            "XYZ29 Fred"
                        ],
                        "Quux": [
                            "ABC16 Quux"
                        ]
                    }
                },
                holidays: [
                    "2024-11-10T22:00:00.000Z",
                    "2024-12-31T22:00:00.000Z",
                    "2024-11-27T22:00:00.000Z",
                    "2024-01-14T22:00:00.000Z",
                    "2024-09-01T21:00:00.000Z",
                    "2024-07-03T21:00:00.000Z",
                    "2024-06-18T21:00:00.000Z",
                    "2024-02-18T22:00:00.000Z",
                    "2024-05-26T21:00:00.000Z",
                    "2024-12-24T22:00:00.000Z",
                    "2024-10-13T21:00:00.000Z",
                    "2024-03-28T22:00:00.000Z"
                ],
                currenciesRates: {
                    "CADILS": 2.53415,
                    "CLPILS": 0.0036565,
                    "CNHILS": 0.49665,
                    "CNYILS": 0.49965,
                    "COPILS": 0.0827,
                    "CZKILS": 0.1497,
                    "DKKILS": 0.50595,
                    "EURILS": 3.77,
                    "GBPILS": 4.5633,
                    "ILSBRL": 0.59028392656868,
                    "ILSSGD": 2.66951414842499,
                    "ILSTHB": 0.10628630341551,
                    "INRILS": 0.042594,
                    "MXNILS": 0.175,
                    "MYRILS": 0.8155,
                    "NOKILS": 0.3187,
                    "NZDILS": 2.03845,
                    "PHPILS": 0.06265,
                    "SEKILS": 0.3291,
                    "TRYILS": 0.1029,
                    "USDILS": 3.6488,
                    "XAUILS": 9544.1289,
                    "ZARILS": 0.1934
                },
                isAdmin: true,
                error: false // change to true to test error handling scenario
            });
        });
    }

    this.dostart = function () {
        const that = this;
        getClientInit().then(response => {

            if (response.error) {
                let allFoundElements = this.element.querySelectorAll(["input", "select", "option", "textarea"]);
                allFoundElements.forEach(element => {
                    element.disabled = true;
                });
                alert("Service is unavailable");
                return;
            }

            this.tradersPortfoliosAccounts = response.tradersPortfoliosAccounts;

            let traderSelect = this.element.querySelector('#trader');
            const traders = Object.keys(this.tradersPortfoliosAccounts);

            if (traders.length > 1) {
                this.isAdmin = true;
                let opt = document.createElement('option');
                opt.value = "";
                opt.innerHTML = "-- Please Select --";
                traderSelect.appendChild(opt);
            }

            for (let i = 0; i < traders.length; i++) {
                let opt = document.createElement('option');
                opt.value = traders[i].toLowerCase();
                opt.innerHTML = traders[i];
                traderSelect.appendChild(opt);
            }
            
            this.holidays = response.holidays;
            this.currenciesRates = response.currenciesRates;

            let ExampleForm = this.element.querySelector('#ExampleForm');
            ExampleForm.addEventListener("submit", async (e) => {
                //Prevent browser default behavior
                e.preventDefault();
                that.sendApproval(e.target);
              });

            this.setDefaultValues();          
              
        })
        .catch(error => {
            console.error(error);
        });

        // Prevent form submission with Enter key
        this.element.querySelector("#ExampleForm").addEventListener('keypress',(e)=>{
            var key = e.charCode || e.keyCode || 0;     
            if (key == 13) {
              console.log("No Enter!");
              e.preventDefault();
            }
          });


    }

    this.setupPreviousTrades = function (previousTrades, gatewayFiles) {
        // Format the date and time, and sort in desc order
        const traders = Object.keys(this.tradersPortfoliosAccounts);
        if (traders.length > 1) {
            this.previousTrades = previousTrades;
            this.gatewayFiles = gatewayFiles;
        } else {
            this.previousTrades[traders[0]] = previousTrades;
            this.gatewayFiles[traders[0]] = gatewayFiles;
        }

        const gatewayTradesKeys = Object.keys(this.gatewayFiles);
        for (let i = 0; i < gatewayTradesKeys.length; i++) {
            const gwTrades = this.gatewayFiles[gatewayTradesKeys[i]];
            if (!gwTrades) continue;
            if (!this.previousTrades[gatewayTradesKeys[i]]) this.previousTrades[gatewayTradesKeys[i]] = [];
            this.previousTrades[gatewayTradesKeys[i]].push(...gwTrades);
        }
        const previousTradesKeys = Object.keys(this.previousTrades);
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        for (let i = 0; i < previousTradesKeys.length; i++) {
            const preTrades = this.previousTrades[previousTradesKeys[i]];
            if (!preTrades) continue;
            for (let j = 0; j < preTrades.length; j++) {
                preTrades[j].tradeDateTimeOrg = preTrades[j].tradeDateTime;
                const month = months[preTrades[j].tradeDateTime.slice(4,6) - 1];
                preTrades[j].tradeDateTime = preTrades[j].tradeDateTime.slice(6,8) + " " + month + " " + preTrades[j].tradeDateTime.slice(0,4) + " " +
                preTrades[j].tradeDateTime.slice(9,11) + ":" + preTrades[j].tradeDateTime.slice(11,13) + ":" + preTrades[j].tradeDateTime.slice(13,15);
                
            }

            // The sort was only relevant when we displayed results in drop box, the new talbe sorts itself - maybe remove this code
            // preTrades.sort(function (a,b) {
            //     return new Date(b.tradeDateTime + " GMT") - new Date(a.tradeDateTime + " GMT");
            // });
        }
    }

    this.setPreviousTradesSelectBox = function () {
        
        // let previousTradesSelect = this.element.querySelector('#previousTrades');
        // previousTradesSelect.innerHTML = "";
        const traders = Object.keys(this.tradersPortfoliosAccounts);
        let traderSelect = this.element.querySelector('#trader');
        let tradesAdded = false;
        let tradesRows = [];
        for (let i = 0; i < traders.length; i++) {
            // filter by selected trader
            if (traderSelect.value != "" && traderSelect.value != traders[i]) continue;
            if (!this.previousTrades[traders[i]]) continue;
            for (let j = 0; j < this.previousTrades[traders[i]].length; j++) {
                let prevTrade = this.previousTrades[traders[i]][j];
                let opt = document.createElement('option');
                let prodType, dir, amount;
                if (prevTrade.instrumentTypeHidden == "CashNOE") {
                    prodType = prevTrade.fx_productType;
                    dir = prevTrade.fx_productDirection == "B"? "Buy":"Sell";
                    amount = prevTrade.fx_tradedAmount;
                } else {

                    // TODO: Remove this once loading/amending options is implemented
                    // continue;

                    prodType = prevTrade.options_contract;
                    dir = prevTrade.options_direction == "B"? "Buy":"Sell";
                    amount = prevTrade.options_ccy1Amount;
                }
                opt.value = prevTrade.trader.toLowerCase() + "/" + j;
                let tradeDateTimeStr = prevTrade.tradeDateTime;
                let ccyPair = prevTrade.ccy_pair.slice(0,3) + "/" + prevTrade.ccy_pair.slice(3,6);
                // TODO: mark if amended/deleted
                opt.innerHTML = prevTrade.trader + " " + tradeDateTimeStr + " " + prodType + " " + ccyPair + " " + dir + " " + amount;
                // previousTradesSelect.appendChild(opt);

                // let dateStr = tradeDateTimeStr; // 01 Jan 1970 00:00:00 GMT
                // "2024-01-18T22:00:00.000Z"
                let settDateStr = (prevTrade.contract_type_code == "FXOPT" || prevTrade.contract_type_code == "EOPT")? prevTrade.options_settlementDate : prevTrade.fx_valueDate;
                let settDateStrArr = settDateStr.split('/');
                settDateStr = settDateStrArr[1] + "/" + settDateStrArr[0] + "/" + settDateStrArr[2];
                tradesRows.push({trader: prevTrade.trader, tradeDate: new Date(tradeDateTimeStr), tradeType: prodType, 
                    ccy1: prevTrade.ccy_pair.slice(0,3), ccy2: prevTrade.ccy_pair.slice(3,6), buySell: dir, amount: amount,
                    rate: (prevTrade.contract_type_code == "FXOPT" || prevTrade.contract_type_code == "EOPT")? prevTrade.options_strike : prevTrade.fx_dealtRate,
                    settDate: new Date(settDateStr),
                    counterParty: prevTrade.tradingParty,
                    status: prevTrade.status? prevTrade.status : "Uploaded", rowId: prevTrade.trader.toLowerCase() + "/" + j, clientTradeId: prevTrade.client_trade_id});

                tradesAdded = true; 
            }
        }
    }


	this.getName = function () {return "ExampleForms"}

    this.closing = function () {
        console.log("Closing veto (override) for screen " + this.screenNum + " panel Demo1Service (" + this.instanceNum + ")");
        // return confirm ("Close screen " + this.screenNum + " Demo1Service (" + this.instanceNum + ")?");
        return true;
    }

    
    this.traderChanged = function (dontChangePreviousTradesSelectBox) {
        
        let traderSelect = this.element.querySelector('#trader');
        let portfoliosSelect = this.element.querySelector('#portfolios');
        portfoliosSelect.innerHTML = "";
        let accountsSelect = this.element.querySelector('#accounts');
        accountsSelect.innerHTML = "";
        if (traderSelect.value == "") {
            if (!dontChangePreviousTradesSelectBox) this.setPreviousTradesSelectBox();
            return;
        }
        const portfolios = Object.keys(this.tradersPortfoliosAccounts[traderSelect.value]);
        if (portfolios.length == 0) {
            this.showErrorAndReturnFalse("Trader has no NW accounts", "portfolios");
            
            let foundElements = this.element.querySelectorAll("input, select, option, textarea", "#" + ExampleForm.id);
            foundElements.forEach(element => {
                element.disabled = true;
            });
            this.element.querySelector('#sendLabel').disabled = true;
            if (!dontChangePreviousTradesSelectBox) this.setPreviousTradesSelectBox();
            return;
        }
        
        for (let i = 0; i < portfolios.length; i++) {
            let opt = document.createElement('option');
            opt.value = portfolios[i];
            opt.innerHTML = portfolios[i];
            portfoliosSelect.appendChild(opt);
        }
        const accounts = Object.keys(this.tradersPortfoliosAccounts[traderSelect.value][portfolios[0]]);
        this.portfolioChanged();
        if (!dontChangePreviousTradesSelectBox) this.setPreviousTradesSelectBox();

    }
    
    this.portfolioChanged = function () {
        
        let traderSelect = this.element.querySelector('#trader');
        let portfoliosSelect = this.element.querySelector('#portfolios');
        const accounts = this.tradersPortfoliosAccounts[traderSelect.value][portfoliosSelect.value];
        let accountsSelect = this.element.querySelector('#accounts');
        accountsSelect.innerHTML = "";
        for (let i = 0; i < accounts.length; i++) {
            let opt = document.createElement('option');
            opt.value = accounts[i];
            opt.innerHTML = accounts[i];
            accountsSelect.appendChild(opt);
        }
    }

    this.instrumentType = "CashNOE";
    this.changeInstrumentType = function () {
        
        if (this.resetNeeded) {
            this.element.querySelector('#instrumentType').checked = false;
            alert("Please reset the form first");
            return;
        }
        if (this.element.querySelector('#instrumentType').checked) {
            this.instrumentType = "OptionNOE";
            this.element.querySelector('#TradeDetailsCash').style.display = "none";
            this.hideAndClearFieldsUnder(this.element.querySelector('#TradeDetailsCash'));
            this.element.querySelector('#TradeDetailsOption').style.display = "block";
            
            // TODO: Remove this once loading/amending options is implemented
            // this.element.querySelector('#loadPreviousTradeButton').style.opacity = "0.5";
            // this.element.querySelector('#loadPreviousTradeButton').disabled = true;
            // this.element.querySelector('#amendPreviousTradeButton').style.opacity = "0.5";
            // this.element.querySelector('#amendPreviousTradeButton').disabled = true;

        } else {
            this.instrumentType = "CashNOE";
            this.element.querySelector('#TradeDetailsCash').style.display = "block";
            this.hideAndClearFieldsUnder(this.element.querySelector('#TradeDetailsOption'));
            
            // TODO: Remove this once loading/amending options is implemented
            // this.element.querySelector('#loadPreviousTradeButton').style.opacity = "1";
            // this.element.querySelector('#loadPreviousTradeButton').disabled = false;
            // this.element.querySelector('#amendPreviousTradeButton').style.opacity = "1";
            // this.element.querySelector('#amendPreviousTradeButton').disabled = false;

        }
        this.element.querySelector('#instrumentTypeHidden').value = this.instrumentType;
        this.swapSelected(false);
        this.contractTypeChanged();
    }

    this.hideAndClearFieldsUnder = function (element) {
        element.style.display = "none";
        const inputsHidden = element.querySelectorAll("input[type='number'], input[type='date'], input[type='text'], select");
        for (let i = 0; i < inputsHidden.length; i++) {
            inputsHidden[i].value = inputsHidden[i].dataset["defaulValue"]? inputsHidden[i].dataset["defaulValue"] : '';
            
        }
    }

    this.isSwap = false;
    this.swapSelected = function (swap) {
        
        if (swap) {
            this.isSwap = true;
            this.element.querySelector('#swapFarFields').style.display = "table-row";
            this.element.querySelector('#swapFarFields2').style.display = "table-row";
            if (this.isNDF) this.element.querySelector('#fx_ndfFields2').style.display = "table-row";
        } else {
            this.isSwap = false;
            this.element.querySelector('#swapFarFields').style.display = "none";
            this.element.querySelector('#swapFarFields2').style.display = "none";
            this.hideAndClearFieldsUnder(this.element.querySelector('#swapFarFields'));
            this.hideAndClearFieldsUnder(this.element.querySelector('#swapFarFields2'));
            if (this.isNDF) this.hideAndClearFieldsUnder(this.element.querySelector('#fx_ndfFields2'));
            this.element.querySelector('#fx_farCounterAmountLabel').innerHTML = "";
        }
    }

    this.expiryPlaceChanged = function () {
        
        let expiryTimeElement = this.element.querySelector('#options_expiryTime');

        if (this.element.querySelector('#options_cutOffTimeZone').selectedOptions.length == 0) 
        {
            expiryTimeElement.options[0].selected = false; // "please select"
        }
        let hours = this.element.querySelector('#options_cutOffTimeZone').selectedOptions[0].dataset.hours;
        
        if (hours.length == 0) 
        {
            for (let i = 0; i < expiryTimeElement.options.length; i++) 
            {
                expiryTimeElement.options[i].disabled = false;
                expiryTimeElement.options[i].style.display = "";
                expiryTimeElement.options[i].selected = false;
            }

            expiryTimeElement.options[0].selected = true;

            return;
        }

        hours = hours.split(",");
        let selectedSet = false;
        let defaulthour = this.element.querySelector('#options_cutOffTimeZone').selectedOptions[0].dataset.defaulthour;
        
        for (let i = 0; i < expiryTimeElement.options.length; i++) 
        {
            if (hours.indexOf(expiryTimeElement.options[i].value) == -1) 
            {
                expiryTimeElement.options[i].disabled = true;
                expiryTimeElement.options[i].style.display = "none";
                expiryTimeElement.options[i].selected = false;
            }
            else 
            {
                expiryTimeElement.options[i].disabled = false;
                expiryTimeElement.options[i].style.display = "";
                if (!selectedSet) 
                {
                    if (defaulthour && defaulthour != expiryTimeElement.options[i].value) continue; // This ensures the defult hour if exists is the one selected
                    expiryTimeElement.options[i].selected = true;
                    selectedSet = true;
                }
            }
        }
    }

    this.currencyChanged = function () {
        
        let leadingField, trailingField, rateField;
        if (this.instrumentType == "CashNOE") {
            leadingField = "fx_tradedCCY";
            trailingField = "fx_counterCCY";
            rateField = "fx_dealtRate_spot";
        } else if (this.instrumentType == "OptionNOE") {
            leadingField = "options_ccy1";
            trailingField = "options_ccy2";
            rateField = "options_strike_spot";
        }
        let leadingCCY = this.element.querySelector('#' + leadingField).value;
        let trailingCCY = this.element.querySelector('#' + trailingField).value;

        // set the default inverted checkbox value
        let invertedByDefault = this.isInvertedByDefault(leadingCCY, trailingCCY);
        // this.element.querySelector('#fx_inverted_rate').checked = invertedByDefault;
        // this.element.querySelector('#fx_inverted_rate_field').style.display = this.element.querySelector('#fx_inverted_rate').checked? "" : "none"; // undecided for now

        let rateElement = this.element.querySelector('#' + rateField);

        let rate = 0, invertedRate = 0;

        if (this.currenciesRates[leadingCCY + trailingCCY]) rate = this.currenciesRates[leadingCCY + trailingCCY];
        else if (this.currenciesRates[trailingCCY + leadingCCY]) rate = 1 / this.currenciesRates[trailingCCY + leadingCCY];
        invertedRate = 1 / rate;
        
        if (rate == 0) {
            // get leading-ils or ils-leading
            let leadingRate = 0, trailingRate = 0;
            if (this.currenciesRates[leadingCCY + "ILS"]) {
                leadingRate = this.currenciesRates[leadingCCY + "ILS"];
                if (this.currenciesRates[trailingCCY + "ILS"]) {
                    trailingRate = this.currenciesRates[trailingCCY + "ILS"];
                    rate = leadingRate / trailingRate;
                } else if (this.currenciesRates["ILS" + trailingCCY]) {
                    trailingRate = this.currenciesRates["ILS" + trailingCCY];
                    rate = leadingRate / trailingRate;
                }
            } else if (this.currenciesRates["ILS" + leadingCCY]) {
                leadingRate = 1 / this.currenciesRates["ILS" + leadingCCY];
                if (this.currenciesRates[trailingCCY + "ILS"]) {
                    trailingRate = this.currenciesRates[trailingCCY + "ILS"];
                    if (leadingCurrencies.indexOf(trailingCCY)) rate = leadingRate / trailingRate;
                    else rate = trailingRate / leadingRate;
                } else if (this.currenciesRates["ILS" + trailingCCY]) {
                    trailingRate = this.currenciesRates["ILS" + trailingCCY];
                    rate = trailingRate / leadingRate;
                }
            }
            invertedRate = 1 / rate;
        }

        if (rate != 0) rateElement.innerHTML = "(Spot = " +
        (invertedByDefault? Math.round(invertedRate * 1000000) / 1000000 + " , ":"") + 
         Math.round(rate * 1000000) / 1000000 + ")"; // round to max 6 digits after decimal point
        else rateElement.innerHTML = "";
    }

    var NDF_ENABLED_CURRENCIES = ["ARS", "BRL", "CLP", "CNY", "COP", "DOP", "DZD", "EGP", "GHS", "IDR", "INR", "KES", "KRW", "KZT", "MYR", "NGN", "PEN", "PHP", "RUB", "THB", "TWD", "UAH", "UYU", "VEB", "VND", "ZMK", "ZMB"];
    var NDF_DEFAULT_CURRENCIES = ["ARS", "BRL", "CLP", "CNY", "COP", "DOP", "EGP", "IDR", "INR", "KRW", "KZT", "MYR", "NGN", "PEN", "PHP", "TWD", "UAH", "UYU", "VEB", "VND"];
    this.isNDF = false;
    this.toggleNDF = function (selectedCurrency, checkbox) {
        
        if (NDF_ENABLED_CURRENCIES.indexOf(selectedCurrency) > -1) {
            this.element.querySelector('#' + checkbox).disabled = false;
            this.element.querySelector('#' + checkbox).checked = NDF_DEFAULT_CURRENCIES.indexOf(selectedCurrency) > -1;
            this.isNDF = this.element.querySelector('#' + checkbox).checked;
        } else {
            this.element.querySelector('#' + checkbox).checked = false;
            this.element.querySelector('#' + checkbox).disabled = true;
            this.isNDF = false;
        }
        this.setNDF();
    }

    this.setNDF = function () {
        
        if (this.element.querySelector('#fx_ndf').checked || this.element.querySelector('#fx_counter_ndf').checked) {
            this.element.querySelector('#fx_ndfFields').style.display = "table-row";
            if (this.isSwap) this.element.querySelector('#fx_ndfFields2').style.display = "table-row";
            // this.isNDF = true;
        } else {
            this.hideAndClearFieldsUnder(this.element.querySelector('#fx_ndfFields'));
            this.hideAndClearFieldsUnder(this.element.querySelector('#fx_ndfFields2'));
            // this.isNDF = false;
        }
    }
    
    this.forceFixing = function (force) {
        
        
        let fixingDate = this.element.querySelector('#options_fixingDate');
        let fixingIndex = this.element.querySelector('#options_fixingIndex');
        
        fixingDate.disabled = !force;
        fixingIndex.disabled = !force;

        if (!force) {
            fixingDate.value = "";
            fixingIndex.value = "";
        }
    }

    this.setFixingForced = function () {
        
        let isdigital = ["Digital"].indexOf(this.element.querySelector('#options_contract').value) > -1;
        
        let fixingDate = this.element.querySelector('#options_fixingDate');
        let fixingIndex = this.element.querySelector('#options_fixingIndex');

        if (isdigital) {
            this.element.querySelector('.options_ndfFields').style.display = "table-row";
            this.element.querySelector('#forceFixingSpan').style.display = this.isNDFOption? "none" : "inline";
            fixingDate.disabled = !this.isNDFOption;
            fixingIndex.disabled = !this.isNDFOption;
        } else {
            this.element.querySelector('#forceFixingSpan').style.display = "none";
            fixingDate.disabled = false;
            fixingIndex.disabled = false;
        }
    }

    this.isNDFOption = false;
    this.setOptionsNDF = function () {
        
        let ccy1Currency = this.element.querySelector('#options_ccy1').value;
        let ccy2Currency = this.element.querySelector('#options_ccy2').value;
        
        if (NDF_ENABLED_CURRENCIES.indexOf(ccy1Currency) > -1 || NDF_ENABLED_CURRENCIES.indexOf(ccy2Currency) > -1) {
            this.isNDFOption = true;
            this.element.querySelector('#options_ndf').value = "ndf";
            this.element.querySelector('.options_ndfFields').style.display = "table-row";
            // this.element.querySelector('#options_delivery').disabled = false;
            
        } else {
            this.isNDFOption = false;
            this.element.querySelector('#options_ndf').value = "";
            this.hideAndClearFieldsUnder(this.element.querySelector('.options_ndfFields'));

            // this.element.querySelector('#options_delivery').disabled = true;
            // this.element.querySelector('#options_delivery').value = "cash";
        }

        this.setFixingForced();

        let updateCurrenciesPercentageStuff = function (selectFieldId) {

            let selectField = element.querySelector('#' + selectFieldId);
            selectField.innerHTML = "";

            let opt = document.createElement('option');
            opt.value = ccy1Currency;
            opt.innerHTML = ccy1Currency;
            selectField.appendChild(opt);

            opt = document.createElement('option');
            opt.value = ccy2Currency;
            opt.innerHTML = ccy2Currency;
            selectField.appendChild(opt);

            if (ccy1Currency != "USD" && ccy2Currency != "USD") {
                opt = document.createElement('option');
                opt.value = "USD";
                opt.innerHTML = "USD";
                selectField.appendChild(opt);
            }

            if (ccy1Currency != "EUR" && ccy2Currency != "EUR") {
                opt = document.createElement('option');
                opt.value = "EUR";
                opt.innerHTML = "EUR";
                selectField.appendChild(opt);
            }

            // let opt = document.createElement('option');
            // opt.value = "%" + ccy1Currency;
            // opt.innerHTML = "%" + ccy1Currency;
            // selectField.appendChild(opt);
            
            // opt = document.createElement('option');
            // opt.value = "%" + ccy2Currency;
            // opt.innerHTML = "%" + ccy2Currency;
            // selectField.appendChild(opt);
            
            // opt = document.createElement('option');
            // opt.value = ccy1Currency + "/100" + ccy2Currency;
            // opt.innerHTML = ccy1Currency + "/100" + ccy2Currency;
            // opt.selected = "selected";
            // selectField.appendChild(opt);
            
            // opt = document.createElement('option');
            // opt.value = ccy2Currency + "/100" + ccy1Currency;
            // opt.innerHTML = ccy2Currency + "/100" + ccy1Currency;
            // selectField.appendChild(opt);

        }

        updateCurrenciesPercentageStuff('options_premiumType');
        updateCurrenciesPercentageStuff('options_rebateCCY');
        
        this.element.querySelector('#options_ccypair').innerHTML = ccy1Currency + "/" + ccy2Currency;

    }

    this.forceDelivery = function (force)
    {

    }

    this.contractTypeChanged = function () {
        

        // hide all fields with class dynamicField, then show then ones needed

        let dynamicFields = this.element.querySelectorAll('#ExampleForm' + " .dynamicFields");
        for (let i = 0; i < dynamicFields.length; i++) {
            this.hideAndClearFieldsUnder(dynamicFields[i]);
        }

        let optionsContract = this.element.querySelector('#options_contract').value;

        optionsContract = optionsContract.charAt(0).toLowerCase() + optionsContract.slice(1);
        optionsContract = optionsContract.replaceAll(" ", "");

        dynamicFields = this.element.querySelectorAll('#ExampleForm' + " .contract_" + optionsContract);
        for (let i = 0; i < dynamicFields.length; i++) {
            dynamicFields[i].style.display = "";
        }

        // If touch - set default style to american
        let optionStyle = document.getElementById("options_style");
        if (["oneTouch", "noTouch", "doubleOneTouch", "doubleNoTouch"].indexOf(optionsContract) > -1) optionStyle.value = "A";
        else optionStyle.value = "E";

        this.tradeDateChanged(true); // Only way to set window start date

        this.setOptionsNDF();
        this.setFixingForced();
    }

    var leadingCurrencies = ["EUR", "GBP", "AUD", "NZD", "USD"];
    this.isInvertedByDefault = function (currency1, currency2) {
        let currency1Index = leadingCurrencies.indexOf(currency1);
        if (currency1Index == -1) currency1Index = 100;
        let currency2Index = leadingCurrencies.indexOf(currency2);
        if (currency2Index == -1) currency2Index = 100;
        let res;
        if (currency1Index <= currency2Index) return false;
        else return true;
    }

    this.getCounterAmount = function (currency1, amount1, currency2, rate) {
        
        
        let invertedRate = this.isInvertedByDefault(currency1, currency2);
        if (this.instrumentType == "CashNOE") {
            if (this.element.querySelector('#fx_inverted_rate').checked) invertedRate = !invertedRate;
        }
        
        if (!invertedRate) res = amount1 * rate;
        else res = amount1 / rate;

        return Math.round((res + Number.EPSILON) * 100) / 100;
    }

    this.amountChanged = function () {
        
        if (this.instrumentType == "CashNOE") {
            let tradedAmount = AutoNumeric.getAutoNumericElement('#fx_tradedAmount').getNumber();
            let dealtRate = AutoNumeric.getAutoNumericElement('#fx_dealtRate').getNumber();
            let counterCCY = this.element.querySelector('#fx_counterCCY').value;
            let tradedCCY = this.element.querySelector('#fx_tradedCCY').value;
            if (tradedAmount && dealtRate) this.element.querySelector('#fx_counterAmountLabel').innerHTML =
            AutoNumeric.format(this.getCounterAmount(tradedCCY, tradedAmount, counterCCY, dealtRate)) + " " + counterCCY;
            else this.element.querySelector('#fx_counterAmountLabel').innerHTML = "";
            if (this.isSwap) {
                let farRate = AutoNumeric.getAutoNumericElement('#fx_farRate').getNumber();
                if (tradedAmount && farRate) this.element.querySelector('#fx_farCounterAmountLabel').innerHTML = AutoNumeric.format(this.getCounterAmount(tradedCCY, tradedAmount, counterCCY, farRate)) + " " + counterCCY;
                else this.element.querySelector('#fx_farCounterAmountLabel').innerHTML = "";
                if (AutoNumeric.getAutoNumericElement('#fx_farAmount').getNumber() != tradedAmount) {
                    this.showErrorAndReturnFalse(null, 'fx_farAmount');
                }
                AutoNumeric.getAutoNumericElement('#fx_farAmount').set(tradedAmount);
            }
        } else if (this.instrumentType == "OptionNOE") {
            let optionsCcy1Amount = AutoNumeric.getAutoNumericElement('#options_ccy1Amount').getNumber();
            let optionsStrike = AutoNumeric.getAutoNumericElement('#options_strike').getNumber();
            let counterCCY = this.element.querySelector('#options_ccy2').value;
            let ccy1 = this.element.querySelector('#options_ccy1').value;
            if (optionsCcy1Amount && optionsStrike) this.element.querySelector('#options_ccy2AmountLabel').innerHTML = AutoNumeric.format(this.getCounterAmount(ccy1, optionsCcy1Amount, counterCCY, optionsStrike)) + " " + counterCCY;
            else this.element.querySelector('#options_ccy2AmountLabel').innerHTML = "";
        }
    }

    this.farAmountChanged = function () {
        
        let farRate = AutoNumeric.getAutoNumericElement('#fx_farRate').getNumber();
        let farAmount = AutoNumeric.getAutoNumericElement('#fx_farAmount').getNumber();
        let counterCCY = this.element.querySelector('#fx_counterCCY').value;
        let tradedCCY = this.element.querySelector('#fx_tradedCCY').value;
        if (farAmount && farRate) {
            this.element.querySelector('#fx_farCounterAmountLabel').innerHTML =
            AutoNumeric.format((this.getCounterAmount(tradedCCY, farAmount, counterCCY, farRate))) + " " + counterCCY;
        }
        else this.element.querySelector('#fx_farCounterAmountLabel').innerHTML = "";
    }

    this.returnDateWithoutTime = function (dateValue) {
        const offsetMs = dateValue.getTimezoneOffset() * 60 * 1000;
        const dateValueLocal = new Date(dateValue.getTime() - offsetMs);
        return dateValueLocal.toISOString().slice(0, 10); //.replace(/-/g, "/").replace("T", " ").replace(/\//g, ""). replace(" ","_").replace(/:/g,"");
    }

    this.expiryDateChanged = function () {
        
        this.element.querySelector('#options_windowEndDate').value = this.element.querySelector('#options_expiryDate').value;
        this.showErrorAndReturnFalse(null, 'options_windowEndDate');
    }

    this.tradeDateChanged = function (dontBlink) {
        
        this.element.querySelector('#options_windowStartDate').value = this.element.querySelector('#options_tradeDate').value;
        if (!dontBlink) this.showErrorAndReturnFalse(null, 'options_windowStartDate');
    }

    this.setDefaultValues = function () {
        
        let nowStr = this.returnDateWithoutTime(new Date());
        
        this.element.querySelector('#fx_tradeDate').value = nowStr;

        let NowPlus2WorkingDaysStr = new Date();
        NowPlus2WorkingDaysStr.setHours(0,0,0,0);
        NowPlus2WorkingDaysStr.setDate(NowPlus2WorkingDaysStr.getDate() + (NowPlus2WorkingDaysStr.getDay() == 4 || NowPlus2WorkingDaysStr.getDay() == 5? 2 : 0) + 2);
        this.element.querySelector('#fx_valueDate').value = this.returnDateWithoutTime(NowPlus2WorkingDaysStr);

        this.element.querySelector('#options_tradeDate').value = nowStr;

        // if (this.instrumentType == "OptionNOE") {
        //     this.element.querySelector('#options_settlementDate').value = nowStr;
        // }

        this.element.querySelector('#fx_productDirection').value = "";
        this.element.querySelector('#options_direction').value = "";
        this.element.querySelector('#options_contractType').value = "CALL";
        this.element.querySelector('#options_premiumType').value = "USD";
        this.element.querySelector('#options_cutOffTimeZone').value = "NEWYORK";
        this.element.querySelector('#options_expiryTime').value = "10:00";

        
        // Reset NDF fields for both fx/options
        this.element.querySelector('#fx_ndf').checked = false;
        this.element.querySelector('#fx_counter_ndf').checked = false;
        this.element.querySelector('#fx_ndf').disabled = true;
        this.element.querySelector('#fx_counter_ndf').disabled = true;

        
        this.element.querySelector('#fx_counterAmountLabel').innerHTML = "";
        this.element.querySelector('#fx_farCounterAmountLabel').innerHTML = "";
        this.element.querySelector('#options_ccy2AmountLabel').innerHTML = "";

        this.hideAndClearFieldsUnder(this.element.querySelector('#fx_ndfFields'));
        this.hideAndClearFieldsUnder(this.element.querySelector('#fx_ndfFields2'));
        this.isNDF = false;

        this.isNDFOption = false;
        this.hideAndClearFieldsUnder(this.element.querySelector('.options_ndfFields'));

        // this.element.querySelector('#options_delivery').disabled = true;
        // this.element.querySelector('#options_delivery').value = "cash";
        
        this.setOptionsNDF();
        this.currencyChanged();
        this.expiryPlaceChanged();
        this.suppressDatesValidationWarning = {};
        
        this.element.querySelector('#amendFile').value = "";
        this.element.querySelector('#approveIncoming').value = "";
        this.element.querySelector('#sendLabel').value = "Send";
        this.element.querySelector('#clearFormButton').style.visibility = "hidden";
        this.element.querySelector('#clearFormButton').disabled = true;
        
        this.element.querySelector('#options_forceDelivery').checked = false;
    }

    this.suppressDatesValidationWarning = {};
    this.checkSuppressValidation = function (elementId) {
        if (!this.suppressDatesValidationWarning[elementId]) {
            return true;
        } else {
            return false;
        }
    }
    this.suppressValidation = function (elementId) {
        
        this.suppressDatesValidationWarning[elementId] = true;
        let elem = this.element.querySelector('#' + elementId);
        elem.tippy.destroy();
    }

    this.showErrorAndReturnFalse = function (msg, elementId, checkSuppressValidation) {
        
        let elem = elementId? this.element.querySelector('#' + elementId) : null;
        if (elem) elem.classList.add("highlight-permanent");
        let elemToolTip;
        if (!checkSuppressValidation && null != msg) {
            elemToolTip = tippy(elem);
            elemToolTip.setContent(msg);
         } else if (null != msg) {
            elemToolTip = tippy(elem, {
            allowHTML: true,
            content: msg + '<br><br><input type="button" value="Suppress warning" class="blueButton" style="border: 4px solid #555; padding: 6px 12px 6px 12px!important;" onclick="vanillaBootComponents.findContainer(this).suppressValidation(\'' + elementId + '\')">',
            interactive: true
            });
            elem.tippy = elemToolTip;
        }
        if (null != msg) elemToolTip.show();
        setTimeout(function () {
            if (elem) {
                elem.classList.remove("highlight-permanent");
                elem.classList.add(null != msg? "highlight" : "highlightQuick");
                setTimeout(function () {
                    elem.classList.remove(null != msg? "highlight" : "highlightQuick");
                    }, null != msg? 3000 : 500);
                    if (null != msg) setTimeout(function () {
                        elemToolTip.destroy();
                        }, 6000);
                    
            }
        }, 100);
        return false;
    }

    this.checkIfUploadedIds = [];

    this.validateForm = function () {
        

        if (this.element.querySelector('#tradingParty').value == '-') return this.showErrorAndReturnFalse("Please select Counter Party", "tradingParty");
        if (this.element.querySelector('#trader').value == '') return this.showErrorAndReturnFalse("Please select Trader", "trader");
        if (this.element.querySelector('#portfolios').value == '') return this.showErrorAndReturnFalse("Please select Portfolio", "portfolios");
        if (this.element.querySelector('#accounts').value == '') return this.showErrorAndReturnFalse("Please select Account", "accounts");

        const today = new Date();
        today.setHours(0,0,0,0);

        if (this.instrumentType == "CashNOE") {

            if (this.element.querySelector('#fx_productDirection').value == '') return this.showErrorAndReturnFalse("Please select a Product Type", "fx_productDirection");

            let tradeDateStr = this.element.querySelector('#fx_tradeDate').value;
            if (tradeDateStr == '') return this.showErrorAndReturnFalse("Please set Trade Date", "fx_tradeDate");
            let tradeDate = new Date(tradeDateStr);
            tradeDate.setHours(0,0,0,0);
            if (tradeDate > today) return this.showErrorAndReturnFalse("Trade Date can't be in the future", "fx_tradeDate");
            
            
            if (this.element.querySelector('#fx_tradedCCY').value == this.element.querySelector('#fx_counterCCY').value) 
                return this.showErrorAndReturnFalse("Counter currency can't be the same as the Traded Currency", "fx_counterCCY");

            if (this.element.querySelector('#fx_dealtRate').value == '') return this.showErrorAndReturnFalse("Please set Dealt Rate", "fx_dealtRate");
            
            let valueDateStr = this.element.querySelector('#fx_valueDate').value;
            if (valueDateStr == '') return this.showErrorAndReturnFalse("Please set Value Date", "fx_valueDate");
            let valueDate = new Date(valueDateStr);
            valueDate.setHours(0,0,0,0);
            const tradeDatePlusTwoDays = new Date(tradeDate);
            tradeDatePlusTwoDays.setDate(tradeDatePlusTwoDays.getDate() + (tradeDatePlusTwoDays.getDay() == 4 || tradeDatePlusTwoDays.getDay() == 5? 2 : 0) + 2);
            let productType = this.element.querySelector('#fx_productType').value;
            if (productType == 'Spot' && valueDate.getTime() !==  tradeDatePlusTwoDays.getTime() && this.checkSuppressValidation("fx_valueDate")) return this.showErrorAndReturnFalse("Spot deal - Value Date must be 2 days after Trade Date", "fx_valueDate", true);
            if (productType == 'Forward' && today.getTime() >= valueDate.getTime() && this.checkSuppressValidation("fx_valueDate")) return this.showErrorAndReturnFalse("Forward deal - Value Date must be greater to today", "fx_valueDate", true);
            if (productType == 'Swap' && today.getTime() > valueDate.getTime() && this.checkSuppressValidation("fx_valueDate")) return this.showErrorAndReturnFalse("Swap deal - Value Date must be greater or equal to today", "fx_valueDate", true);

            if (this.element.querySelector('#fx_tradedAmount').value == '') return this.showErrorAndReturnFalse("Please enter the Traded Amount", "fx_tradedAmount");
            
            if (this.isNDF) {
                
                let fixingDateStr = this.element.querySelector('#fx_fixingDate').value;
                if (fixingDateStr == '') return this.showErrorAndReturnFalse("Please set Fixing Date", "fx_fixingDate");
                let fixingDate = new Date(fixingDateStr);
                fixingDate.setHours(0,0,0,0);
                if (valueDate.getTime() < fixingDate.getTime() && this.checkSuppressValidation("fx_fixingDate")) return this.showErrorAndReturnFalse("Fixing Date must be earlier or equal to Value Date", "fx_fixingDate", true);

                // if (this.element.querySelector('#fx_fixingIndex').value == '') return this.showErrorAndReturnFalse("Please select Fixing Index", "fx_fixingIndex");
            }
            
            
            if (this.isSwap) {
                
                if (this.element.querySelector('#fx_farAmount').value == '') return this.showErrorAndReturnFalse("Please set Far Amount", "fx_farAmount");

                if (this.element.querySelector('#fx_farRate').value == '') return this.showErrorAndReturnFalse("Please set Far Rate", "fx_farRate");
                
                let farValueDateStr = this.element.querySelector('#fx_farDate').value;
                if (farValueDateStr == '') return this.showErrorAndReturnFalse("Please set Far Value Date", "fx_farDate");
                let farValueDate = new Date(farValueDateStr);
                farValueDate.setHours(0,0,0,0);
                if (farValueDate <= valueDate) return this.showErrorAndReturnFalse("Far Value Date has to be greater than the Value Date", "fx_farDate");

                if (this.isNDF) {

                    let farFixingDateStr = this.element.querySelector('#fx_farFixingDate').value;
                    if (farFixingDateStr == '') return this.showErrorAndReturnFalse("Please set Far Leg Fixing Date", "fx_farFixingDate");
                    farFixingDate = new Date(farFixingDateStr);
                    farFixingDate.setHours(0,0,0,0);
                    if (farValueDate.getTime() < farFixingDate.getTime() && this.checkSuppressValidation("fx_farFixingDate")) return this.showErrorAndReturnFalse("Far Fixing Date must be earlier or equal to Far Value Date", "fx_farFixingDate", true);

                    if (this.element.querySelector('#fx_farFixingIndex').value == '') return this.showErrorAndReturnFalse("Please select Far Leg Source", "fx_farFixingIndex");
                }

            }

        } else if (this.instrumentType == "OptionNOE") {

            if (this.element.querySelector('#options_direction').value == '') return this.showErrorAndReturnFalse("Please select Buy/Sell", "options_direction");
            
            if (this.element.querySelector('#options_ccy1').value == this.element.querySelector('#options_ccy2').value) 
                return this.showErrorAndReturnFalse("Currency 1 can't be the same as Currency 2", "options_ccy2");

            if (["Vanilla", "Single Barrier", "Double Barrier"].indexOf(this.element.querySelector('#options_contract').value) != -1 &&
                this.element.querySelector('#options_ccy1Amount').value == '') return this.showErrorAndReturnFalse("Please set CCY1 Amount", "options_ccy1Amount");
            if (["One Touch", "No Touch", "Double One Touch", "Double No Touch"].indexOf(this.element.querySelector('#options_contract').value) == -1 &&
                this.element.querySelector('#options_strike').value == '') return this.showErrorAndReturnFalse("Please set the Strike", "options_strike");
            if (this.element.querySelector('#options_premiumAmount').value == '') return this.showErrorAndReturnFalse("Please set the Option Premium", "options_premiumAmount");
            if (this.element.querySelector('#options_cutOffTimeZone').value == '') return this.showErrorAndReturnFalse("Please set the Expiry (place)", "options_cutOffTimeZone");
            if (this.element.querySelector('#options_expiryTime').value == '') return this.showErrorAndReturnFalse("Please set the Expiry time", "options_expiryTime");

            let tradeDateStr = this.element.querySelector('#options_tradeDate').value;
            if (tradeDateStr == '') return this.showErrorAndReturnFalse("Please set Trade Date", "options_tradeDate");
            let tradeDate = new Date(tradeDateStr);
            tradeDate.setHours(0,0,0,0);
            if (tradeDate > today) return this.showErrorAndReturnFalse("Trade Date can't be in the future", "options_tradeDate");

            let expiryDateStr = this.element.querySelector('#options_expiryDate').value;
            if (expiryDateStr == '') return this.showErrorAndReturnFalse("Please set Expiry Date", "options_expiryDate");
            let expiryDate = new Date(expiryDateStr);
            expiryDate.setHours(0,0,0,0);
            if (expiryDate < today) return this.showErrorAndReturnFalse("Expiry Date must be greater or equal to today", "options_expiryDate");

            let settlementDateStr = this.element.querySelector('#options_settlementDate').value;
            if (settlementDateStr == '') return this.showErrorAndReturnFalse("Please set the Settlement Date", "options_settlementDate");
            let settlementDate = new Date(settlementDateStr);
            settlementDate.setHours(0,0,0,0);
            const expiryPlusTwoDays = new Date(expiryDate);
            expiryPlusTwoDays.setDate(expiryPlusTwoDays.getDate() + (expiryPlusTwoDays.getDay() == 4 || expiryPlusTwoDays.getDay() == 5? 2 : 0) + 2);
            if (settlementDate.getTime() !== expiryPlusTwoDays.getTime() && this.checkSuppressValidation("options_settlementDate")) return this.showErrorAndReturnFalse("Settlement Date must be 2 days from the Expiry Date", "options_settlementDate", true);
            
            let premiumDateStr = this.element.querySelector('#options_premiumDate').value;
            if (premiumDateStr == '') return this.showErrorAndReturnFalse("Please set the Premium Date", "options_premiumDate");
            let premiumDate = new Date(premiumDateStr);
            premiumDate.setHours(0,0,0,0);
            const tradeDatePlusTwoDays = new Date(tradeDate);
            tradeDatePlusTwoDays.setDate(tradeDatePlusTwoDays.getDate() + (tradeDatePlusTwoDays.getDay() == 4 || tradeDatePlusTwoDays.getDay() == 5? 2 : 0) + 2);
            if (premiumDate.getTime() !== tradeDatePlusTwoDays.getTime() &&
            premiumDate.getTime() !== settlementDate.getTime() && this.checkSuppressValidation("options_premiumDate")) return this.showErrorAndReturnFalse("Premium Date must be 2 days from the Trade Date, or equal to the Settlement Date", "options_premiumDate", true);
            
            if (this.isNDFOption || this.element.querySelector('#forceFixing').checked) {
                let fixingDateStr = this.element.querySelector('#options_fixingDate').value;
                if (fixingDateStr == '') return this.showErrorAndReturnFalse("Please set the Fixing Date", "options_fixingDate");
                let fixingDate = new Date(fixingDateStr);
                fixingDate.setHours(0,0,0,0);
                if (fixingDate.getTime() !== expiryDate.getTime() && this.checkSuppressValidation("options_fixingDate")) return this.showErrorAndReturnFalse("Fixing Date must be equal to Expity Date", "options_fixingDate", true);

                if (this.element.querySelector('#options_fixingIndex').value == '') return this.showErrorAndReturnFalse("Please select Fixing Index", "options_fixingIndex");
            }

            if (["Single Barrier", "Double Barrier"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_barrierType').value == '') return this.showErrorAndReturnFalse("Please select Barrier Type", "options_barrierType");
            }

            if (["Digital", "Digital Single Barrier", "Digital Double Barrier", "One Touch", "No Touch", "Double One Touch", "Double No Touch"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_rebateAmount').value == '') return this.showErrorAndReturnFalse("Please set Rebate amount", "options_rebateAmount");
                if (this.element.querySelector('#options_rebateCCY').value == '') return this.showErrorAndReturnFalse("Please select Rebate currency", "options_rebateCCY");
            }
            if (["Single Barrier", "Double Barrier", "One Touch", "No Touch", "Double One Touch", "Double No Touch", "Digital Double Barrier", "Digital Single Barrier"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_windowStartDate').value == '') return this.showErrorAndReturnFalse("Please select Window Start Date", "options_windowStartDate");
                if (this.element.querySelector('#options_windowEndDate').value == '') return this.showErrorAndReturnFalse("Please select Window End Date", "options_windowEndDate");
                let windowStartDate = new Date(this.element.querySelector('#options_windowStartDate').value);
                let windowEndDate = new Date(this.element.querySelector('#options_windowEndDate').value);
                if (windowEndDate < windowStartDate) return this.showErrorAndReturnFalse("Window End Date is before the Window Start Date", "options_windowEndDate");
            }

            if (["Single Barrier"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_barrier').value == '') return this.showErrorAndReturnFalse("Please set a Barrier", "options_barrier");
            }

            if (["Double Barrier"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_lowerBarrier').value == '') return this.showErrorAndReturnFalse("Please set a Lower Barrier", "options_lowerBarrier");
                if (this.element.querySelector('#options_upperBarrier').value == '') return this.showErrorAndReturnFalse("Please Please set an Upper Barrier", "options_upperBarrier");
            }

            if (["Single Barrier", "Digital Single Barrier", "One Touch", "No Touch"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_touchDirection').value == '') return this.showErrorAndReturnFalse("Please select Touch Direction", "options_touchDirection");
            }

            if (["One Touch", "No Touch"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_oneTouchBarrier').value == '') return this.showErrorAndReturnFalse("Please  set a Barrier", "options_oneTouchBarrier");
            }

            if (["Double One Touch", "Double No Touch"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
               if (this.element.querySelector('#options_doubleOneTouchLowerBarrier').value == '') return this.showErrorAndReturnFalse("Please set a Lower Barrier", "options_doubleOneTouchLowerBarrier");
               if (this.element.querySelector('#options_doubleOneTouchUpperBarrier').value == '') return this.showErrorAndReturnFalse("Please Please set an Upper Barrier", "options_doubleOneTouchUpperBarrier");
            }

            if (["Digital Double Barrier", "Digital Single Barrier"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_digitalBarrierType').value == '') return this.showErrorAndReturnFalse("Please select Barrier Type", "options_digitalBarrierType");
            }

            if (["Digital Double Barrier"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_digitalLowerBarrier').value == '') return this.showErrorAndReturnFalse("Please set a Lower Barrier", "options_digitalLowerBarrier");
                if (this.element.querySelector('#options_digitalUpperBarrier').value == '') return this.showErrorAndReturnFalse("Please Please set an Upper Barrier", "options_digitalUpperBarrier");
            }

            if (["Digital Single Barrier"].indexOf(this.element.querySelector('#options_contract').value) > -1) {
                if (this.element.querySelector('#options_digitalBarrier').value == '') return this.showErrorAndReturnFalse("Please  set a Barrier", "options_digitalBarrier");
            }

        } else {
            alert("Error - Please refresh page");
            return false;
        }
        // if (this.isAdmin) {
        //     // This is an admin - let's give an option to name the generated file
        //     this.generatedFileName = prompt("Ready to send? You can decide how to name the file here:");
        //     if (this.generatedFileName == null) return false;
        //     else {
        //         this.generatedFileName = this.generatedFileName.trim();
        //         if (this.generatedFileName != "" && false == /^[a-zA-Z][a-zA-Z0-9 \-]+$/.test(this.generatedFileName)) {
        //             alert("file name must start with a letter and contain [a-z,0-9, ,-] only");
        //             return false;
        //         }
        //         return true;
        //     }

        // } else {
            return confirm("Are you ready to send the form?");
        // }
    }
    this.generatedFileName = "";

    this.resetNeeded = false;
    this.resetForm = function () {
        this.checkIfUploaded();
        this.resetNeeded = false;
        // $("#ExampleForm" + " :input").prop('readonly', false);
        
        let foundElements = this.element.querySelectorAll("input, select, option, textarea", "#ExampleForm"); //.prop('disabled', false);
        foundElements.forEach(element => {
            element.disabled = false;
        });
        
        this.element.querySelector('#ExampleForm').reset();
        this.traderChanged();
        this.contractTypeChanged();
        this.swapSelected(false);
        if (this.instrumentType != "CashNOE") {
            this.changeInstrumentType();
            this.setDefaultValues();
        }
        this.element.querySelector('#fx_counterAmountLabel').innerHTML = "";
        this.element.querySelector('#fx_farCounterAmountLabel').innerHTML = "";
        this.element.querySelector('#options_ccy2AmountLabel').innerHTML = "";
        this.hideAndClearFieldsUnder(this.element.querySelector('#fx_ndfFields'));
        this.hideAndClearFieldsUnder(this.element.querySelector('#fx_ndfFields2'));
        // this.element.querySelector('#options_delivery').disabled = true;
        // this.element.querySelector('#options_delivery').value = "cash";
        
        
        this.element.querySelector('#sendLabel').style.visibility = "visible";
        this.element.querySelector('#sendLabel').value = "Send";
        this.element.querySelector('#clearFormButton').style.visibility = "hidden";
        this.generatedFileName = "";
        this.element.querySelector('#amendFile').value = "";
        this.element.querySelector('#approveIncoming').value = "";
        this.setDefaultValues();
        if (this.isAdmin) {
            this.element.querySelector('#deletePreviousTradeButton').disabled = false;
            this.element.querySelector('#deletePreviousTradeButton').style.opacity = "1";
        } else {
            this.element.querySelector('#deletePreviousTradeButton').disabled = true;
            this.element.querySelector('#deletePreviousTradeButton').style.opacity = "0.3";
        }
    }

    this.sendApproval = function (ExampleForm) {

        
        
        this.element.querySelector('#sendLabel').disabled = true;

        if (!this.validateForm()) 
        {
            this.element.querySelector('#sendLabel').disabled = false;
            return;
        }

        let formFields = new FormData(this.element.querySelector("#" + ExampleForm.id));
        //TODO: instrumentType is missing (dropeed by new FormData() when submitting, for weird reason) - for now there's a workaround inside loadPreviousTrade()
        let formDataObject = Object.fromEntries(formFields.entries());

        // Following hack fixes when autoNumeric fails to unformatOnSubmit (https://github.com/autoNumeric/autoNumeric/issues/588)
        // let textFields = ExampleForm.querySelectorAll("input[type=text]");
        let autoNumericFields = ExampleForm.getElementsByClassName("number");
        for (let i = 0; i < autoNumericFields.length; i++) {
            // if (!textFields[i].classList.contains("number")) continue;
            formDataObject[autoNumericFields[i].name] = AutoNumeric.getAutoNumericElement('#' + autoNumericFields[i].id).getNumber();
        }
        
        formDataObject.tempTimeString = new Date(); // Makes the formData unique for server hashing, as protection from unwanted repeated requests

        let formDataJsonString = JSON.stringify(formDataObject);
        const that = this;

        // fetch('./ExampleFormsService.sendApproval', {
        // method: 'post',
        // body: JSON.stringify({formData: formDataJsonString, generatedFileName: this.generatedFileName}),
        // headers: { 'Content-Type': 'application/json; charset=utf-8' }
        // })
        // .then(httpResponse => httpResponse.json())
        // .then(response => {

        //     if (response.error && !response.proceed) {
        //         that.showErrorAndReturnFalse(response.error, "sendLabel");
        //         this.element.querySelector('#sendLabel').disabled = false;
        //         return;
        //     }
            
            let foundElements = this.element.querySelectorAll("input, select, option, textarea", "#" + ExampleForm.id);
            foundElements.forEach(element => {
                element.disabled = true;
            });

            this.element.querySelector('#clearFormButton').disabled = false;

            this.element.querySelector('#sendLabel').style.visibility = "hidden";
            this.element.querySelector('#sendLabel').disabled = false;
            this.element.querySelector('#clearFormButton').style.visibility = "visible";
            
            that.resetNeeded = true;

            // alert("Form submitted.");
            // if (!response.error) 
                that.showErrorAndReturnFalse("Form submitted 👍👍👍", "clearFormButton");
            // else that.showErrorAndReturnFalse(response.error, "clearFormButton");
            
            // that.setupPreviousTrades(response.previousTrades); // Disabled because upload of new trade file is not immediate atm
            // if (!response.error) {
            //     that.checkIfUploadedIds.push(response.clientTradeId);
            // }
            
        // })
        // .catch(error => {
        //     console.error(error);
        // });
    }
    
    this.checkIfUploaded = function () {
        let that = this;
        setTimeout(()=>{
            fetch('./ExampleFormsService.getPreviousTrades', {
                method: 'post',
                body: JSON.stringify({trader: "", clientTradeIds: that.checkIfUploadedIds}),
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
                })
                .then(httpResponse => httpResponse.json())
                .then(response => {
                    if (response.status == "ok") {
                        that.setupPreviousTrades(response.previousTrades, response.gatewayFiles);
                        if (!that.isAdmin) {
                            that.traderChanged();
                        } else {
                            that.setPreviousTradesSelectBox();
                        }
                        // flash the change
                        that.showErrorAndReturnFalse(null, "tradesGrid");
                    }
                    const previousTradesKeys = Object.keys(this.previousTrades);
                    let addedIndeed = false;
                    for (let i = 0; i < previousTradesKeys.length; i++) {
                        const preTrades = this.previousTrades[previousTradesKeys[i]];
                        for (let j = 0; j < preTrades.length; j++) {
                            const element = preTrades[j];
                            let idx = that.checkIfUploadedIds.indexOf(preTrades[j].client_trade_id);
                            if (idx > -1) {
                                addedIndeed = true; // this will make the prev trades combobox blink
                                that.checkIfUploadedIds.splice(idx, 1); // as long as we have ids here - we'll keep checking
                            }
                        }
                    }
                    if (addedIndeed) that.showErrorAndReturnFalse("Last trade added 👍👍👍", "tradesGrid");
                    if (that.checkIfUploadedIds.length > 0) that.checkIfUploaded();
                });
        }, 2000);
    }


      
  
}

_ExampleForms.prototype = new VanillaBootComponent();
_ExampleForms.prototype.constructor = _ExampleForms;