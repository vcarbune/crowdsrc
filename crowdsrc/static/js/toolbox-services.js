/**
 * Toolbox Services - External Communication Interface (toolboxService)
 *                  - Internal Shared Service (internalService)
 *
 * NOTE: You MUST define the app in the page that includes this file:
 *    e.g. app = angularjs.module('angularjs-toolbox');
 *
 * The main SharedService is passed through all the components, and it
 * incorporates multiple other subservices.
 */

/**
 * The ToolboxService is the service through which an external page should
 * interact with the toolbox. An external page can also hook-up to the other
 * internal services but it's fairly discouraged.
 */
app.factory('toolboxService', function($rootScope, internalService) {
  var toolboxService = {};

  toolboxService.getToolboxStringifiedJson = function() {
    return internalService.serializationService.getSortedContent();
  };

  toolboxService.getInputsStringifiedJson = function() {
    return internalService.inputExtractionService.getInputs();
  };

  toolboxService.prepareToolboxFormElements = function() {
	  $rootScope.$broadcast('prepareCreateTaskForm'); 
  };

  toolboxService.prepareToolboxInputElements = function() {
    $rootScope.$broadcast('prepareCompleteTaskForm');
  };

  return toolboxService;
});
/* The SharedService is an overall service handler and container for other
 * shared resources required by various components. */
app.factory('internalService', function($rootScope) {
  var internalService = {};

  internalService.serializationService = new SerializationService($rootScope);
  internalService.inputExtractionService = new InputExtractionService($rootScope);
  internalService.stateService = new StateService($rootScope);

  return internalService;
});

/**
 * The SerializationService handles the transformation of each toolbox component
 * into its JSON equivalent, ready to be stored in the backend.
 */
function SerializationService(angularRootScope) {
  this.content = [];

  this.appendItem = function(item) {
    this.content.push(item);
  };
  
  this.start = function() {
    this.content = [];
    angularRootScope.$broadcast(SerializationService.EVENTS.START);
  };

  this.getContent = function() {
    return window.JSON.stringify(this.content);
  };

  // FIXME: To make the code cleaner and page-independent, the permutation
  // should be given as parameter, rather than using the jQuery hack.
  this.getSortedContent = function() {
    var permutation = $('.toolbox-item-list').sortable('toArray');

    var orderedContent = new Array(this.content.length);
    for (var index = 0; index < this.content.length; index++) {
      var id = parseInt(permutation[index]);
      orderedContent[index] = this.content[id];
    }
    
    return window.JSON.stringify(orderedContent);
  };

};

SerializationService.EVENTS = {
  START: 'serializationStart'
};

/**
 * The InputExtractionService extracts the input values
 * from all the components.
 */
function InputExtractionService(angularRootScope) {
  this.inputs = [];

  this.appendInput = function(input) {
    this.inputs.push(input);
  };
  
  this.getInputs = function() {
    return window.JSON.stringify(this.inputs);
  };
  
  this.start = function() {
    this.inputs = [];
    angularRootScope.$broadcast(InputExtractionService.EVENTS.START);
  };
};

InputExtractionService.EVENTS = {
  START: 'inputExtractionStart'
}

/**
 * The StateService broadcasts to each component whether it needs to change
 * its state or not (e.g. preview for workers or edit for creators)
 */
function StateService(angularRootScope) {
  this.currentState = StateService.STATES.EDIT;

  this.validateStateValue = function(value) {
    if (value in StateService.STATES)
      return value;

    // Fallback on the safest possible state, if invalid.
    return StateService.STATES.PREVIEW;
  };

  this.getState = function() {
    return this.currentState;
  };

  this.setState = function(value) {
    value = this.validateStateValue(value);

    if (this.currentState != value) {
      console.log('StateService::setState('+value+')');

      this.currentState = value;
      angularRootScope.$broadcast(StateService.EVENTS.CHANGE);
    }
  };
};

StateService.STATES = {
  PREVIEW: 'PREVIEW',
  EDIT: 'EDIT',
  COMPLETED: 'COMPLETED'
};

StateService.EVENTS = {
  CHANGE: 'stateChanged'
};
