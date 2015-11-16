'use strict';

function renderLogo() {
	//var THREE = THREE || {};
	//var THREEx = THREEx || {};
	var renderWidth = 85;
	var renderHeight = 85;

	var renderer	= new THREE.WebGLRenderer({
	            	alpha: true,
	            	antialias: true
	});
	renderer.setSize( renderWidth, renderHeight );
	// Grab the header and append the renderer
	var domHeader = document.getElementById('navigation');
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0px';
	renderer.domElement.style.left = '5px';
	//renderer.domElement.style.position = 'relative';
	//renderer.domElement.style.left = '-245px';
	domHeader.appendChild(renderer.domElement);

	//document.body.appendChild( renderer.domElement );
	renderer.shadowMapEnabled	= true;

	var onRenderFcts= [];
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(75, renderWidth / renderHeight, 0.01, 100 );
	camera.position.z = 1;

	var ambientLight	= new THREE.AmbientLight( 0x222222 );
	scene.add( ambientLight );

	var directionalLight	= new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set(5,5,5);
	scene.add( directionalLight );
	directionalLight.castShadow	= true;
	directionalLight.shadowCameraNear	= 0.01;
	directionalLight.shadowCameraFar	= 15;
	directionalLight.shadowCameraFov	= 45;

	directionalLight.shadowCameraLeft	= -1;
	directionalLight.shadowCameraRight	=  1;
	directionalLight.shadowCameraTop	=  1;
	directionalLight.shadowCameraBottom= -1;
	// directionalLight.shadowCameraVisible	= true

	directionalLight.shadowBias	= 0.001;
	directionalLight.shadowDarkness	= 0.2;

	directionalLight.shadowMapWidth	= 1024;
	directionalLight.shadowMapHeight	= 1024;


	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////

	//var datGUI	= datGUI || new dat.GUI();

	var containerEarth	= new THREE.Object3D();
	containerEarth.rotateZ(-13.4 * Math.PI/180);
	containerEarth.position.z	= 0;
	scene.add(containerEarth);

	var earthMesh	= THREEx.Planets.createEarth();
	earthMesh.receiveShadow	= true;
	earthMesh.castShadow	= true;
	containerEarth.add(earthMesh);
	onRenderFcts.push(function(delta, now){
		earthMesh.rotation.y += 1/24 * delta;		
	});

	var geometry	= new THREE.SphereGeometry(0.5, 32, 32);
	var material	= THREEx.createAtmosphereMaterial();
	material.uniforms.glowColor.value.set(0x00b3ff);
	material.uniforms.coeficient.value	= 0.8;
	material.uniforms.power.value		= 2.0;
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.01);
	containerEarth.add( mesh );
	//var threemat = new THREEx.addAtmosphereMaterial2DatGui(material, datGUI);

	var geometry	= new THREE.SphereGeometry(0.5, 32, 32);
	var material	= THREEx.createAtmosphereMaterial();
	material.side	= THREE.BackSide;
	material.uniforms.glowColor.value.set(0x00b3ff);
	material.uniforms.coeficient.value	= 0.5;
	material.uniforms.power.value		= 9.0;
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.15);
	containerEarth.add( mesh );
	// new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)

	var earthCloud	= THREEx.Planets.createEarthCloud();
	earthCloud.receiveShadow	= true;
	earthCloud.castShadow	= true;
	containerEarth.add(earthCloud);
	onRenderFcts.push(function(delta, now){
		earthCloud.rotation.y += 1/8 * delta;		
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	/*
		 var mouse	= {x : 0, y : 0};
		 document.addEventListener('mousemove', function(event){
		 mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
		 mouse.y	= (event.clientY / window.innerHeight) - 0.5;
		 }, false);
		 onRenderFcts.push(function(delta, now){
		 camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3);
		 camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3);
		 camera.lookAt( scene.position );
		 });
		 */

	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null;
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
		lastTimeMsec	= nowMsec;
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000);
		});
	});

}
