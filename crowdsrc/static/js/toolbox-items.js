/**
 * Toolbox - Generic Item Controller
 */
function ToolboxItemCtrl($scope, toggleStateService, serializationService)
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
    switch(toggleStateService.getState())
    {
    case toggleStateService.STATE.EDIT:
      $scope.makeEditableForCreator();	
      break;
    case toggleStateService.STATE.PREVIEW:
      $scope.makeEditableForWorker();
      break;
    case toggleStateService.STATE.COMPLETED:
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
      serializationService.appendItem($scope.itemContent);

    console.log(serializationService.getContent());
  };

  $scope.$on('serializationStart', $scope.serialize);
  $scope.$on('stateChanged', $scope.updateItemState);

  $scope.updateItemState();
}

/**
 * Toolbox - Text Field Controller.
 */
function ParagraphCtrl($scope, toggleStateService, serializationService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleStateService: toggleStateService,
    serializationService: serializationService 
  });

  $scope.itemContent = {
    type: 'paragraph',
    name: 'Paragraph'
  };
};

/**
 * Toolbox - Text Field Controller.
 */
function TextFieldCtrl($scope, toggleStateService, serializationService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleStateService: toggleStateService,
    serializationService: serializationService 
  });

  $scope.itemContent = {
    type: 'textField',
    name: 'Text Field'
  };
};

/**
 * Toolbox - Checkbox Controller.
 */
function CheckboxCtrl($scope, toggleStateService, serializationService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleStateService: toggleStateService,
    serializationService: serializationService 
  });
  
  $scope.itemContent = {
    type: 'checkbox',
    name: 'Checkbox'
  };
};

/**
 * Toolbox - Radio Group Controller.
 */
function RadioGroupCtrl($scope, toggleStateService, serializationService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleStateService: toggleStateService,
    serializationService: serializationService 
  });

  $scope.itemContent = {
    type: 'radioGroup',
    name: 'Radio Group'
  };
  
  $scope.items = [];
  $scope.selectedItem = null;
  
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
};

/**
 * Toolbox - Ranking Component Controller.
 */
function RankingCtrl($scope, toggleStateService, serializationService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleStateService: toggleStateService,
    serializationService: serializationService
  });

  $scope.itemContent = {
    type: 'ranking',
    name: 'Ranking Component'
  };
  
  $scope.items = []
  $scope.orderedItems = [];
  $scope.currentRank = 0;
  
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
};

/**
 * Toolbox - Image Group Controller.
 */
function ImageGroupCtrl($scope, $http, toggleStateService, serializationService) {

  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleStateService: toggleStateService,
    serializationService: serializationService 
  });

  $scope.itemContent = {
    type: 'imageGroup',
    name: 'Image Group'
  };

  MAX_PREVIEW_IMG = 10;
  DEFAULT_IMG_PER_TASK = 3;
  $scope.itemContent.nrImagesPerTask = DEFAULT_IMG_PER_TASK;

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

  $scope.uploadFiles = function() {
    fd = new FormData();
    for(i = 0; i < $scope.files.length; ++i)
      fd.append('files', $scope.files[i]);
    request = {
      method: 'POST',
      url: '/upload_files/',
      data: fd,
      headers: {'Content-Type': undefined},
      transformRequest: angular.identity
    };

    $http(request).
      success(function(data, status, headers, config) {
        alert('success!');
      }).
      error(function(data, status, headers, config) {
        alert('error status ' + status);
        console.log(data);
      }).
      then(function(response) {
        console.log(response);
      });
  }
};
