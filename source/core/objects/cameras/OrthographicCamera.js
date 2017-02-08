"use strict";

/**
 * Orthographic Camera is used for 2D like image projection
 * 
 * @class OrthographicCamera
 * @constructor
 * @extends {THREE.OrthographicCamera}
 * @module Cameras
 * @param {Number} size Camera size relative to resize mode
 * @param {Number} aspect Aspect ratio X/Y
 * @param {Number} mode Camera resize mode (RESIZE_HORIZONTAL or RESIZE_VERTICAL)
 * @param {Number} near Near projection plane
 * @param {Number} far Far projection plane
 */
function OrthographicCamera(size, aspect, mode, near, far)
{
	THREE.OrthographicCamera.call(this, -1.0, 1.0, 1.0, -1.0, near, far);

	this.name = "camera";

	this.size = (size != undefined) ? size : 10.0;
	this.aspect = (aspect != undefined) ? aspect : 1.0;
	this.mode = (mode !== undefined) ? mode : OrthographicCamera.RESIZE_HORIZONTAL;

	this.offset = new THREE.Vector2(0.0, 0.0);
	this.viewport = new THREE.Vector2(1.0, 1.0);
	this.clearColor = false;
	this.clearDepth = false;
	this.order = 0;
	
	this.updateProjectionMatrix();
}

OrthographicCamera.prototype = Object.create(THREE.OrthographicCamera.prototype);

/**
 * Used to set camera to resize horizontally 
 * @attribute RESIZE_HORIZONTAL
 * @type {Number}
 */
OrthographicCamera.RESIZE_HORIZONTAL = 0;

/**
 * Used to set camera to resize vertically 
 * @attribute RESIZE_VERTICAL
 * @type {Number}
 */
OrthographicCamera.RESIZE_VERTICAL = 1;

/**
 * Destroy camera object and remove it from the scene
 * @method destroy
 */
OrthographicCamera.prototype.destroy = function()
{
	var scene = ObjectUtils.getScene(this);
	if(scene !== null)
	{
		scene.removeCamera(this);
	}
	
	THREE.Object3D.prototype.destroy.call(this);
}

/**
 * Update camera projection matrix
 * Should be called after chaging projection parameters
 * @method updateProjectionMatrix
 */
OrthographicCamera.prototype.updateProjectionMatrix = function()
{
	//Update left right, top and bottom values from aspect and size
	if(this.mode === OrthographicCamera.RESIZE_HORIZONTAL)
	{
		this.top = this.size / 2;
		this.bottom = -this.top;
		this.right = this.top * this.aspect * (this.viewport.x / this.viewport.y);
		this.left = -this.right;
	}
	else if(this.mode === OrthographicCamera.RESIZE_VERTICAL)
	{
		this.right = this.size / 2;
		this.left = -this.right;
		this.top = this.right / this.aspect * (this.viewport.x / this.viewport.y);
		this.bottom = -this.top;
	}

	THREE.OrthographicCamera.prototype.updateProjectionMatrix.call(this);
}

/**
 * Create JSON description
 * @method toJSON
 * @param  {Object} meta
 * @return {Object} JSON descrition
 */
OrthographicCamera.prototype.toJSON = function(meta)
{
	var data = THREE.OrthographicCamera.prototype.toJSON.call(this, meta);

	data.object.size = this.size;
	data.object.aspect = this.aspect;
	data.object.mode = this.mode;

	data.object.clearColor = this.clearColor;
	data.object.clearDepth = this.clearDepth;
	data.object.viewport = this.viewport.toArray();
	data.object.offset = this.offset.toArray();
	data.object.order = this.order;

	return data;
}
