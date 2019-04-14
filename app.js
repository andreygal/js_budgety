var budgetModel = (function() {
    var x = 24;
    
    var add = function(a) {
        return x + a; 
    }
    
    return {
        publicTest: function(b) {
            return(add(b));
        }
    }
})();

var budgetView = (function() {
    //some code 
})(); 

var budgetController = (function(budgetMod, budgetVw) {
    
    var z = budgetMod.publicTest(5); 
    
    return {
        anotherPublic: function() {
            console.log(z); 
        }
    }
})(budgetModel, budgetView); 