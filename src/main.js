// Budget Controller
var budgetController = (function() {

})();







// UI Controller
var UIController = (function() {

    // storing all the UI classes as object

    var DOMStrings = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn"
    };

    return {
        // function to return the 3 input values
        getInput: () => {
            // return as 3 variables or as a single object
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDesc).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        // function to return dom strings
        getDOMStrings: () => {
            return DOMStrings;
        }
    };

})();







// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMStrings();

    var ctrlAddItem = () => {

        // 1. Get Data

        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add item to budget controller

        // 3. Add item to UI

        // 4. Calculate Budget

        // 5. Display budget on UI
    }
    
    // click button
    document.querySelector(DOM.addBtn).addEventListener("click", ctrlAddItem);
    
    // or press enter
    document.addEventListener("keypress", (e) => {
        // console.log(e);

        // e.which === 13 for older browsers
        if(e.keyCode === 13 || e.which === 13) {
            // console.log("Enter key was pressed")
            ctrlAddItem();
        }
    });
        
})(budgetController, UIController);