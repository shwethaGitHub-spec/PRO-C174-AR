var modelList = [];
AFRAME.registerComponent("markerhandler", {
  init: async function() {
    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("value");
      modelList.push({
        model_name: modelName,
        barcode_value: barcodeValue
      });

      this.el.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name");
      var index = modelList.findIndex(x => x.model_name === modelName);

      if (index > -1) {
        modelList.splice(index, 1);
      }

      // NOTE: Remove all the childs from base model
    });
  },
  getDistance: function(elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  isModelPresentInArray: function(arr, val) {
    for (var i of arr) {
      if (i.model_name === val) {
        return true;
      }
    }
    return false;
  },
  tick: function() {
    if (modelList.length > 1) {
      var isBaseModelPresent = this.isModelPresentInArray(modelList, "base");
      var messageText = document.querySelector("#message-text");

      if (!isBaseModelPresent) {
        messageText.setAttribute("visible", true);
      } else {
        messageText.setAttribute("visible", false);
        this.placeTheModel("road");
        this.placeTheModel("car");
        this.placeTheModel("building1");
        this.placeTheModel("building2");
        this.placeTheModel("building3");
        this.placeTheModel("tree");
        this.placeTheModel("sun");
      }
    }
  },
  placeTheModel: function(modelName) {
    var isListContainModel = this.isModelPresentInArray(modelList, modelName);
    if (isListContainModel) {
      var distance = null;
      var marker1 = document.querySelector(`#marker-base`);
      var marker2 = document.querySelector(`#marker-${modelName}`);

      distance = this.getDistance(marker1, marker2);
      if (distance < 1.25) {
        // Changing Model Visibility
        var modelEl = document.querySelector(`#${modelName}`);
        modelEl.setAttribute("visible", false);

        // Checking Model placed or not in scene
        var isModelPlaced = document.querySelector(`#model-${modelName}`);
        if (isModelPlaced === null) {
          var position = modelEl.getAttribute("position");
          var rotation = modelEl.getAttribute("rotation");
          var scale = modelEl.getAttribute("scale");
          var modelUrl = modelEl.getAttribute("gltf-model");

          var el = document.createElement("a-entity");
          el.setAttribute("id", `model-${modelName}`);
          el.setAttribute("position", position);
          el.setAttribute("gltf-model", `url(${modelUrl})`);
          el.setAttribute("rotation", rotation);
          el.setAttribute("scale", scale);
          marker1.appendChild(el);
        }
      }
    }
  }
});
