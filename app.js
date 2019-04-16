var budgetModel = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };
    
    var Income = function(id, description, value) {
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };
    

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expensesContainer: '.expenses__list'
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
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = ""; 
            });
            
            fieldsArr[0].focus(); 
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
    
    };
    
    var updateBudget = function() {
        
        
    };
    
    var ctrlAddItem = function() {
        var input = budgetVw.getInput(); 
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            var newItem = budgetMod.addItem(input.type, input.description, input.value);
            budgetVw.addListItem(newItem, input.type);
            budgetVw.clearFields(); 
        }
    };
    
    return {
        init: function() {
            console.log('Application has started'); 
            setupEventListeners(); 
        }
    };
    
})(budgetModel, budgetView); 

budgetController.init(); 