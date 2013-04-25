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

  $scope.$on('serializationStart', $scope.serialize);
  $scope.$on('inputExtractionStart', $scope.extractInput);
  $scope.$on('stateChanged', $scope.updateItemState);  

  $scope.updateItemState();
}

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
	      textFieldLabel: 'Label:'
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
  
  $scope.getInput = function() {	 
	  return {
		  id: $scope.content.id,
		  type: 'text',
		  value: $scope.textFieldValue
	  };
  };
};

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
            {id: 0, name: "New item"},
            {id: 1, name: "New item"},
            {id: 2, name: "New item"}
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
            {id: 0, name: 'New item', rank: 100, state: 'free'},
            {id: 1, name: 'New item', rank: 100, state: 'free'},
            {id: 2, name: 'New item', rank: 100, state: 'free'},
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

/**
 * Toolbox - Image Group Controller.
 */
function ImageGroupCtrl($scope, $http, internalService) {

  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    internalService: internalService
  });
  
  $scope.init = function() {
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
	          for (i in data.resources) {
	        	  console.log(decodeURI(data.resources[i].url));
	        	  $scope.previewImgs.push(decodeURI(data.resources[i].url));
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

  $scope.refreshPreviewImages = function() {
     $scope.previewImgs = [];
     for(i = 0; i < $scope.files.length && i < $scope.itemContent.nrImagesPerTask; ++i)
     {
       oFReader = new FileReader();
       oFReader.readAsDataURL($scope.files[i]);
       oFReader.onload = function(oFREvent) {
         $scope.previewImgs.push(oFREvent.target.result);
       }
     }
  }

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
    $scope.refreshPreviewImages();
  }
};
