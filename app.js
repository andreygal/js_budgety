var budgetModel = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id; 
        this.description = description; 
        this.value = value;
        this.percentage = -1; 
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }
    };
    
    Expense.prototype.getPercentage = function(totalIncome) {
        return this.percentage; 
    };
    
    var Income = function(id, description, value) {
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };
    
    var calculateTotal = function(type) {
        var sum = 0; 
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; 
        });
        data.totals[type] = sum; 
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID, itemArr; 
            itemArr = data.allItems[type];
            
            if (itemArr.length !== 0) {
                ID = itemArr[itemArr.length - 1].id + 1;                         
            } else {
                ID = 0;
            }
               
            if (type === 'exp') {
                newItem = new Expense(ID, des, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            itemArr.push(newItem); 
            return newItem; 
        },
        
        deleteItem: function(type, id) {
            var ids, index; 
           
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id); 
          
            if (index !== -1) {
                data.allItems[type].splice(index, 1); 
            }
        },
        
        calculateBudget: function(type) {
            calculateTotal(type); 
            data.budget = data.totals.inc - data.totals.exp; 
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1; 
            }
        
        },
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc); 
            })
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage(); 
            });
            return allPerc; 
        },
        
        getBudget: function() {
            return {
                budget:     data.budget,
                totalInc:   data.totals.inc,
                totalExp:   data.totals.exp,
                percentage: data.percentage
            }
        },
        
        testing: function() {
            console.log(data); 
        }
    };
    

})();



var budgetView = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value', 
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPerLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
        
    };
    
     var formatNumber = function(num, type) {
            var numSplit, int, dec, sign; 
            num = (Math.abs(num)).toFixed(2); 
            numSplit = num.split('.');
        
            int = numSplit[0];
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr((int.length - 3), 3); 
            }
            
            dec = numSplit[1]; 
            
            type === 'exp' ? sign = '-' : sign = '+';
            
            return sign + ' ' + int + '.' + dec;
    };
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
                callback(list[i], i); 
        }
    };
    
    return { 
        getInput: function() {
            //+ inc or - exp
            return {
                type:         document.querySelector(DOMstrings.inputType).value,
                description:  document.querySelector(DOMstrings.inputDescription).value,
                value:        parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
                
        getDOMstrings: function() {
            return DOMstrings;
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element; 
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMstrings.expensesContainer; 
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            if (type === 'exp') {
                newHtml = newHtml.replace('%percentage%', obj.percentage);
            }
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el); 
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = ""; 
            });
            
            fieldsArr[0].focus(); 
        },
        
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, 'inc');  
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');  
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');  
            if (obj.percentage > 0) { 
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPerLabel);
            
         
            
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '__'; 
                }
            });
        },
        
        displayMonth: function() {
            var now, date, dateArr; 
            now = new Date(); 
            dateArr = (now.toDateString()).split(' ');
            date = dateArr[1] + ' ' + dateArr[3];
            document.querySelector(DOMstrings.dateLabel).textContent = date; 
        },
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue); 
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red'); 
        }
        
    };
})(); 


var budgetController = (function(budgetMod, budgetVw) {
    
    var setupEventListeners = function () {
        var DOMstrings = budgetVw.getDOMstrings(); 
        
        document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which ===13) {
            ctrlAddItem();    
            }
     
        });
        
        document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOMstrings.inputType).addEventListener('change', budgetVw.changedType);
    
    };
    
    var updateBudget = function() {
        var budget = budgetMod.getBudget();
        budgetView.displayBudget(budget); 
    };
    
    var updatePercentages = function() {
        budgetMod.calculatePercentages();
        var percentages = budgetMod.getPercentages();
        console.log(percentages); 
        budgetVw.displayPercentages(percentages); 
        
    }
    
    var ctrlAddItem = function() {
        var input = budgetVw.getInput(); 
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            var newItem = budgetMod.addItem(input.type, input.description, input.value);
            budgetVw.addListItem(newItem, input.type);
            budgetVw.clearFields(); 
            budgetMod.calculateBudget(input.type);
            updateBudget(); 
            updatePercentages(); 
        }
        
    };
    
    var ctrlDeleteItem = function(e) {
        var itemID, splitID, type, ID;
        
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0].substr(0, 3);
            ID = parseInt(splitID[1]);
            budgetMod.deleteItem(type, ID); 
            budgetVw.deleteListItem(itemID); 
            budgetMod.calculateBudget(type);
            updateBudget();
            updatePercentages(); 
        }
    }
    
    return {
        init: function() {
            console.log('Application has started'); 
            setupEventListeners(); 
            updateBudget();
            budgetVw.displayMonth();
        },
        
        testing: function() {
            return 
        }
    };
    
})(budgetModel, budgetView); 

budgetController.init(); 