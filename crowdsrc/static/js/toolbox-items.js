/**
 * Toolbox - Generic Item Controller
 */
function ToolboxItemCtrl($scope, internalService)
{
  $scope.makeEditableForWorker = function() {
    $scope.isEditable = false;
    $scope.disabled = false;
  };

  $scope.makeEditableForCreator = function() {
    $scope.isEditable = true;
    $scope.disabled = true;
  };
  
  $scope.makeCompleted = function() {
    $scope.isEditable = false;
    $scope.disabled = true;
  };

  $scope.updateItemState = function() {
    switch(internalService.stateService.getState())
    {
    case StateService.STATES.EDIT:
      $scope.makeEditableForCreator();	
      break;
    case StateService.STATES.PREVIEW:
      $scope.makeEditableForWorker();
      break;
    case StateService.STATES.COMPLETED:
      $scope.makeCompleted();
      break;
    default:
      // do nothing
      break;
    }
  }
  
  $scope.doValidation = function() {
	  $scope.validateInput();
  };
  
  $scope.validateInput = function() {
  }

  $scope.serialize = function() {
    // In case we need any particular dark magic for components,
    // override this function in the required component.
    if (typeof $scope.prepareSerialization == "function")
      $scope.prepareSerialization();

    if (typeof $scope.itemContent == "object")
      internalService.serializationService.appendItem($scope.itemContent);
  };
  
  $scope.extractInput = function() {	 
	  input = $scope.getInput();
	
	  if (input)
	    internalService.inputExtractionService.appendInput(input);
  };
  
  $scope.getInput = function() {
	  return null;
  };

  $scope.$on('validationStart', $scope.doValidation);
  $scope.$on('serializationStart', $scope.serialize);
  $scope.$on('inputExtractionStart', $scope.extractInput);
  $scope.$on('stateChanged', $scope.updateItemState);  

  $scope.updateItemState();
};

/* For each new toolbox item, please map its string type to its controller */
ToolboxItemCtrl.StringToCtrlMap = {};

/**
 * Toolbox - Text Field Controller.
 */
function ParagraphCtrl($scope, internalService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService,
  });
  
  $scope.init = function(id) {
	  if (!$scope.itemContent || $scope.itemContent == '') {  
        $scope.itemContent = {
          type: 'paragraph',
          name: 'Paragraph',
          paragraphText: 'Enter text here...'
        };

        if (id !== undefined)
          $scope.itemContent.id = id;
	  }
  }
};

ParagraphCtrl.NAME = 'Paragraph Component';
ParagraphCtrl.TYPE = 'paragraph';
ParagraphCtrl.ICON = 'paragraph.png';
ParagraphCtrl.HTML = 
  "<div ng-controller='ParagraphCtrl' ng-init='init(content.id)' >" +
    "<p contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.paragraphText' ng-bind-html-unsafe='itemContent.paragraphText'>Enter text here...</p>" +
  "</div>";

ToolboxItemCtrl.StringToCtrlMap[ParagraphCtrl.TYPE] = ParagraphCtrl;
 
/**
 * Toolbox - Text Field Controller.
 */
function TextFieldCtrl($scope, internalService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService,
  });
  
  $scope.init = function(id) {
	  if (!$scope.itemContent || $scope.itemContent == '') {
	    $scope.itemContent = {
	      type: 'textField',
	      name: 'Text Field',
	      textFieldLabel: 'Label: '
	    };
	  } else {
	    // set the input value, in case we view a solution
	    if ($scope.itemContent.inputValue) {
	      $scope.textFieldValue = $scope.itemContent.inputValue;
	    }
	  }

    if (id !== undefined)
      $scope.itemContent.id = id;
  };
  
  $scope.validateInput = function() {
	$scope.error = '';
	if (!$scope.textFieldValue) {
      internalService.validationService.invalidate(); 
      $scope.error = 'The field is empty.';
	}
  };
  
  $scope.getInput = function() {	 
	  return {
		  id: $scope.content.id,
		  type: 'text',
		  value: $scope.textFieldValue
	  };
  };
};

TextFieldCtrl.NAME = 'Text Field Component';
TextFieldCtrl.TYPE = 'textField';
TextFieldCtrl.ICON = 'textField.png'
TextFieldCtrl.HTML =
  "<div ng-controller='TextFieldCtrl' ng-init='init(content.id)' >" +
    "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.textFieldLabel' ng-bind-html-unsafe='itemContent.textFieldLabel'>Enter contents here... </div>" + 
    "<input id='task_{{content.id}}' ng-model='textFieldValue' name='task_{{content.id}}' value='{{textFieldValue}}' type='text' ng-disabled='disabled' />" +
    "<span class='task-input-error'>{{error}}</span>" +
  "</div>";

ToolboxItemCtrl.StringToCtrlMap[TextFieldCtrl.TYPE] = TextFieldCtrl;

/**
 * Toolbox - Number Field Controller.
 */
function NumberFieldCtrl($scope, internalService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService,
  });
  
  $scope.init = function(id) {
	  if (!$scope.itemContent || $scope.itemContent == '') {
	    $scope.itemContent = {
	      type: 'numberField',
	      name: 'Number Field',
	      textFieldLabel: 'Label: '
	    };
	  } else {
	    // set the input value, in case we view a solution
	    if ($scope.itemContent.inputValue) {
	      $scope.textFieldValue = $scope.itemContent.inputValue;
	    }
	  }

    if (id !== undefined)
      $scope.itemContent.id = id;
  };
  
  $scope.validateInput = function() {
	$scope.error = '';  
	if (!$scope.textFieldValue) {
      internalService.validationService.invalidate(); 
      $scope.error = 'The field is empty.';
	}
	else {
	  number = parseFloat($scope.textFieldValue);
	  if (isNaN(number)) {
		internalService.validationService.invalidate(); 
	    $scope.error = 'The value is not a number.';
	  }
	} 
  };
  
  $scope.getInput = function() {	 
	  return {
		  id: $scope.content.id,
		  type: 'number',
		  value: $scope.textFieldValue
	  };
  };
};

NumberFieldCtrl.NAME = 'Number Field Component';
NumberFieldCtrl.TYPE = 'numberField';
NumberFieldCtrl.ICON = 'numberField.png'
NumberFieldCtrl.HTML =
  "<div ng-controller='NumberFieldCtrl' ng-init='init(content.id)' class='task-generic-item'>" +
    "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.textFieldLabel' ng-bind-html-unsafe='itemContent.textFieldLabel'>Label: </div>" + 
    "<input id='task_{{content.id}}' ng-model='textFieldValue' name='task_{{content.id}}' value='{{textFieldValue}}' type='text' ng-disabled='disabled' />" +
    "<span class='task-input-error'>{{error}}</span>" +
  "</div>";

ToolboxItemCtrl.StringToCtrlMap[NumberFieldCtrl.TYPE] = NumberFieldCtrl;

/**
 * Toolbox - Checkbox Controller.
 */
function CheckboxCtrl($scope, internalService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService,
  });
  
  $scope.init = function(id) {
	  if (!$scope.itemContent || $scope.itemContent == '') {
	    $scope.itemContent = {
	      type: 'checkbox',
	      name: 'CheckBox',
	      checkBoxLabel: 'Label'
	    };
	  } else {
	    // set the input value, in case we view a solution
	    if ($scope.itemContent.inputValue !== undefined) {
		    $scope.checkBoxValue = ($scope.itemContent.inputValue.toLowerCase() == 'true');
	    }
	  }

    if (id !== undefined)
      $scope.itemContent.id = id;
  }
  
  $scope.getInput = function() {	 
	  return {
		  id: $scope.content.id,
		  type: 'boolean',
		  value: $scope.checkBoxValue
	  };
  };
};

CheckboxCtrl.NAME = 'Checkbox Component';
CheckboxCtrl.TYPE = 'checkbox';
CheckboxCtrl.ICON = 'checkbox.png';
CheckboxCtrl.HTML =
  "<div ng-controller='CheckboxCtrl' ng-init='init(content.id)' >" +
    "<input id='task_{{content.id}}' ng-model='checkBoxValue' name='task_{{content.id}}' type='checkbox' ng-disabled='disabled' />" +
    "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.checkBoxLabel' ng-bind-html-unsafe='itemContent.checkBoxLabel'>Label</div>" +
  "</div>";

ToolboxItemCtrl.StringToCtrlMap[CheckboxCtrl.TYPE] = CheckboxCtrl;

/**
 * Toolbox - Radio Group Controller.
 */
function RadioGroupCtrl($scope, internalService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService,
  });
  
  $scope.init = function(id) {
	if (!$scope.itemContent || $scope.itemContent == '') {
	  $scope.itemContent = {
	    type: 'radioGroup',
	    name: 'Radio Group'
	  };
	  $scope.items = [
        {id: 0, name: "Item 1"},
        {id: 1, name: "Item 2"},
        {id: 2, name: "Item 3"}
      ];
	}
	else {
	  $scope.items = [];
          angular.forEach($scope.itemContent.items, function(item) {
            $scope.items.push({
              id: item.id,
              name: item.name
            });
          });
      
      // set the input value, in case we view a solution
      if ($scope.itemContent.inputValue) {
    	$scope.radioValue = $scope.itemContent.inputValue;
      }
	}
  if (id !== undefined)
    $scope.itemContent.id = id;
  }

  $scope.radioValue = '0';
  
  $scope.setRadioValue = function(val) {
	$scope.radioValue = val;
  };
  
  $scope.addItem = function() {
	$scope.items.push({
		id: $scope.items.length,
		name: "New item"
	});
  };
  
  $scope.removeItem = function(id) {
	  for (var i=0; i<$scope.items.length; i++) {
		  if ($scope.items[i].id == id) {
			  for (var j=0; j<$scope.items.length; j++) {
				  if ($scope.items[j].id > id) {
					  $scope.items[j].id--;
				  }
			  }
			  $scope.items.splice(i, 1);
			  break;
		  }
	  }
  };

  // This is needed because angularJS inserts some hashKeys
  // to the items that we don't want to serialize.
  $scope.prepareSerialization = function() {
    $scope.itemContent.items = [];
    angular.forEach($scope.items, function(item) {
      $scope.itemContent.items.push({
        id: item.id,
        name: item.name
      });
    });
  };
  
  $scope.getInput = function() {	 
	return {
		id: $scope.content.id,
		type: 'integer',
		value: $scope.radioValue
	};
  };
};

RadioGroupCtrl.NAME = 'Radio Group Component';
RadioGroupCtrl.TYPE = 'radioGroup';
RadioGroupCtrl.ICON = 'radioGroup.png';
RadioGroupCtrl.HTML = 
  "<div ng-controller='RadioGroupCtrl' ng-init='init(content.id)' >" +
    "<span ng-click='addItem()' ng-show='isEditable' class='toolbox-item-add' title='Add Item'></span>" +
    "<div ng:repeat='i in items'>" +
      "<input type='radio' name='task_{{content.id}}' value='{{i.id}}' ng-model='radioValue' ng-change='setRadioValue(radioValue)' id='radio_{{i.id}}' ng-disabled='disabled' />" +
      "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='items[i.id].name' ng-bind-html-unsafe='items[i.id].name'>New Item</div>" +
      "<span ng-click='removeItem(i.id)' ng-show='isEditable' class='toolbox-item-remove'></span>" +
    "</div>" +
  "</div>";

ToolboxItemCtrl.StringToCtrlMap[RadioGroupCtrl.TYPE] = RadioGroupCtrl;  

/**
 * Toolbox - Ranking Component Controller.
 */
function RankingCtrl($scope, internalService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService,
  });
  
  $scope.init = function(id) {
	$scope.currentRank = 0;

	if (!$scope.itemContent || $scope.itemContent == '') {
	  $scope.itemContent = {
	    type: 'ranking',
	    name: 'Ranking Component'
	  };
	  $scope.items = [
        {id: 0, name: 'Item 1', rank: 100, state: 'free'},
        {id: 1, name: 'Item 2', rank: 100, state: 'free'},
        {id: 2, name: 'Item 3', rank: 100, state: 'free'},
      ];

	} else {
	  $scope.items = [];
          angular.forEach($scope.itemContent.items, function(item) {
            $scope.items.push({
              id: item.id,
              name: item.name,
              rank: item.rank,
              state: item.state
            });
          });
      
      // set the input value, in case we view a solution
      if ($scope.itemContent.inputValue) { 
    	  var order=$scope.itemContent.inputValue.split(" ", $scope.items.length);
    	  for (var i in order) {
		      $scope.items[i].rank = order[i];
		      $scope.items[i].state = 'selected';
    	  }
      }
	}

    if (id !== undefined)
      $scope.itemContent.id = id;
  }
  
  $scope.addItem = function() {
	  $scope.items.push({
		  id: $scope.items.length,
		  name: 'New item',
		  rank: 100, // big enough
		  state: 'free',
	  });
  };
  
  $scope.removeItem = function(id) {
	  for (var i=0; i<$scope.items.length; i++) {
		  if ($scope.items[i].id == id) {
			  for (var j=0; j<$scope.items.length; j++) {
				  if ($scope.items[j].id > id) {
					  $scope.items[j].id--;
				  }
			  }
			  $scope.items.splice(i, 1);
			  break;
		  }
	  }
  };
  
  $scope.toggleSelectItem = function(id) {
	  if ($scope.isEditable === true || $scope.disabled === true) {
		  return;
	  }
	  
	  for (var i=0; i<$scope.items.length; i++) { 
		  if ($scope.items[i].id == id) {
			  var item = $scope.items[i];
			  if (item.state === 'selected') {
				  item.state = 'free';
				  for (var j=0; j<$scope.items.length; j++) {
					  if ($scope.items[j].state === 'selected' && $scope.items[j].rank > item.rank) {
						  $scope.items[j].rank--;
					  }
				  }
				  item.rank = 0;
				  $scope.currentRank--;
			  }
			  else {
				  item.state = 'selected';
				  item.rank = ++$scope.currentRank;
			  }
			  break;
		  }
	  }
  }

  // This is needed because angularJS inserts some hashKeys
  // to the items that we don't want to serialize.
  $scope.prepareSerialization = function() {
    $scope.itemContent.items = [];

    angular.forEach($scope.items, function(item) {
      $scope.itemContent.items.push({
        id: item.id,
        name: item.name,
        rank: item.rank,
        state: item.state
      });
    });
  };
  
  $scope.validateInput = function() {
	$scope.error = '';  
	for (i in $scope.items) {
	  if ($scope.items[i].state != 'selected') {
		  internalService.validationService.invalidate();
		  $scope.error = 'Not all items have been ranked.';
	  }
	} 
  };
  
  $scope.getInput = function() {	 
	  value = '';
	  for (i in $scope.items) {
		  value = value + $scope.items[i].rank + ' ';
	  }
	
	  return {
		  id: $scope.content.id,
		  type: 'ranking',
		  value: value
	  };
  };
};

RankingCtrl.NAME = 'Ranking Component';
RankingCtrl.TYPE = 'ranking';
RankingCtrl.ICON = 'ranking.png';
RankingCtrl.HTML =
  "<div ng-controller='RankingCtrl' ng-init='init(content.id)' >" +
    "<p>Click the items in the order you want to rank them.</p>" +
    "<div ng-model='itemContent.id' ng-show='false'>{{content.id}}</div>" +
    "<span ng-click='addItem()' ng-show='isEditable' class='toolbox-item-add'></span>" +
	  "<ul class='toolbox-ranking-list'>" +
	    "<li ng-repeat='i in items' class='{{i.state}}'>" +
	  	  "<span class='toolbox-ranking-name toolbox-editable' " + 
            "contenteditable='{{isEditable}}' ng-click='toggleSelectItem(i.id)' ng-model='items[i.id].name' ng-bind-html-unsafe='items[i.id].name'>New item</span>" +
	  	  "<span class='toolbox-ranking-rank' ng-hide='isEditable || i.state===\"free\"'>{{i.rank}}</span>" +
	  	  "<span ng-click='removeItem(i.id)' ng-show='isEditable' class='toolbox-item-remove'></span>" +
	    "</li>" +
    "</ul>" +
    "<span class='task-input-error'>{{error}}</span>" +
  "</div>";

ToolboxItemCtrl.StringToCtrlMap[RankingCtrl.TYPE] = RankingCtrl;

/**
 * Toolbox - Image Group Controller.
 */
function ImageGroupCtrl($scope, $http, internalService) {

  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService
  });
  
  $scope.init = function(id) {
	  if (!$scope.itemContent || $scope.itemContent == '') {
	    $scope.itemContent = {
	      type: 'imageGroup',
	      name: 'Image Group'
	    };
	    $scope.itemContent.nrImagesPerTask = DEFAULT_IMG_PER_TASK;
	  } else {
		if ($scope.itemContent.solutionId) {
		  request = {
	        method: 'GET',
	        url: '/get_solution_resources/' + $scope.itemContent.solutionId + '/' + $scope.itemContent.nrImagesPerTask + '/',
	        transformRequest: angular.identity
	      };
				  
	      $http(request).
	        success(function(data, status, headers, config) {
	          $scope.previewImgs = [];
                  $scope.titles = [];
	          for (i in data.resources) {
	        	  console.log(decodeURI(data.resources[i].url));
	        	  $scope.previewImgs.push(decodeURI(data.resources[i].url));
                          $scope.titles.push(data.resources[i].name);
	          }
	        }).
	        error(function(data, status, headers, config) {
	          console.log(data);
	        }).
	        then(function(response) {
	          console.log(response);
	        }
	      );
		}
	  }

    if (id !== undefined)
      $scope.itemContent.id = id;
  }

  MAX_PREVIEW_IMG = 10;
  DEFAULT_IMG_PER_TASK = 3;

  $scope.setFiles = function(element) {
    // Filter image files.
    rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    // TO DO: Adjust maximum size of uploaded images.
    FILE_SIZE_MAX = 30000000;
    // Uploaded files
    $scope.files = [];

    for(i = 0; i < element.files.length; ++i)
      if(rFilter.test(element.files[i].type) && element.files[i].size < FILE_SIZE_MAX)
        $scope.files.push(element.files[i]);
  }
};

ImageGroupCtrl.NAME = 'Image Group';
ImageGroupCtrl.TYPE = 'imageGroup';
ImageGroupCtrl.ICON = 'imageGroup.png';
ImageGroupCtrl.HTML =
  "<div ng-controller='ImageGroupCtrl' ng-init='init(content.id)' >" +
    // Content for EDIT state.
    "<label for='resources_{{content.id}}' ng-show='isEditable'>Task Images: </label>" +
    "<input type='file' name='resource_files' ng-model-instant onchange='angular.element(this).scope().setFiles(this)' ng-show='isEditable' multiple required />" +
    "<p ng-show='isEditable'>Used Images: " +
      "<input ng-model='itemContent.nrImagesPerTask' type='number' min='1' max='10' ng-show='isEditable' required />" +
    "</p>" +
    
    // Content for PREVIEW state.
    "<div style='text-align:center; margin: 0 auto; overflow: hidden;' ng-hide='isEditable'>" +
      "<div style='float:left' ng-repeat='image in previewImgs' ng-hide='isEditable'>" +
        "<img src={{image}} ng-hide='isEditable' Hspace='30' />" +
        "<br/>{{titles[$index]}}<br/><br/>" +
      "</div ng-hide='isEditable'>" +
    "</div ng-hide='isEditable'>" +
  "</div>";

ToolboxItemCtrl.StringToCtrlMap[ImageGroupCtrl.TYPE] = ImageGroupCtrl;
