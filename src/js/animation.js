import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


gsap.set(
	[
		'.main',
		'.editor-body',
		'.editor-sidebar',
		'.editor-explorer',
		'.editor-explorer-wrap',
		'.editor-content',
		'.editor-tab',
		'.editor-breadcrumbs',
		'.editor-field',
		'.editor-terminal',
		'.editor-terminal-tab',
		'.editor-terminal-field'
	],
	{
		perspective: 800,
		transformStyle: 'preserve-3d',
		autoAlpha: 1,
	}
);

gsap.set(
	'.editor',
	{
		perspective: 800,
		transformStyle: 'preserve-3d',
		opacity: 0,
		rotateX: 15
	}
);

const tl = gsap.timeline({
	defaults: {
		duration: 1.5,
	}
});

tl.fromTo(
	'.main-intro-elem', 
	{opacity: 0, y: '25'}, 
	{opacity: 1, y: '0', stagger: 1}
)
.to(
	'.main-intro-elem', 
	{duration: .5, opacity: '0', display: 'none'},
	'+=2')
.to(
	'.editor', 
	{
		opacity: 1
	},
	'+=.5'
)
.fromTo(
	'.editor-head',
	{opacity: '0', y: -30, z: 80},
	{opacity: '1', y: 0, z: 0},
	'+=.5'
)
.fromTo(
	'.editor-footer',
	{opacity: '0', y: -50, z: 25},
	{opacity: '1', y: 0, z: 0},
	'<'
)
.fromTo(
	'.editor-sidebar',
	{opacity: '0', y: -30, z: 30},
	{opacity: '1', y: 0, z: 0},
	'-=.5'
)
.fromTo(
	'.editor-sidebar-btn',
	{opacity: '0', z: 10},
	{duration: .5, opacity: '1', z: 0}
)
.fromTo(
	'.editor-explorer',
	{opacity: '0', scale: '1.05', z: 30},
	{duration: .8, opacity: '1', scale: '1', z: 0},
	'-=.4'
)
.fromTo(
	'.editor-explorer-title',
	{opacity: '0', scale: '1.03', z: 40},
	{duration: .5, opacity: '1', scale: '1', z: 0},
)
.fromTo(
	'.editor-explorer-elem',
	{opacity: '0', z: 25},
	{duration: .5, opacity: '1', z: 0, stagger: .3},
	'-=.4'
)
.fromTo(
	'.editor-terminal',
	{opacity: '0', z: 25},
	{opacity: '1', z: 0, stagger: .3},
	'<'
)
.fromTo(
	'.editor-tab-elem',
	{opacity: '0', scale: '1.01', z: 25},
	{opacity: '1', scale: '1', z: 0},
	'<'
)
.fromTo(
	'.editor-terminal-tab-btn',
	{opacity: '0', z: 15},
	{duration: .35, opacity: '1', z: 0, stagger: .2},
	'<'
)
.fromTo(
	'.editor-terminal-row',
	{opacity: '0', z: 15},
	{duration: .8, opacity: '1', z: 0, stagger: .2},
)
.fromTo(
	'.editor-breadcrumbs',
	{opacity: '0', z: 10},
	{duration: .4, opacity: '1', z: 0},
	'<'
)
.fromTo(
	'.editor-breadcrumbs-elem',
	{opacity: '0', scale: '1.02', z: 20},
	{duration: .5, opacity: '1', z: 0, stagger: .3},
	'-=.3'
)
.fromTo(
	'.editor-field',
	{opacity: '0', z: 20},
	{opacity: '1', z: 0},
	'-=.3'
)
.fromTo(
	'.editor-field-row',
	{opacity: '0', z: 20},
	{duration: .5, opacity: '1', z: 0, stagger: .3}
)
.to(
	'.editor',
	{
		rotateX: 0,
		onComplete: afterFunction,
	},
	'<'
);

function afterFunction() {
	const editorField = document.querySelector('.editor-field');
	const terminalInputField = document.querySelector('.editor-terminal-input-field');

	console.log('animation end')

	editorField.style.overflowY = 'auto';
	terminalInputField.focus();
}


(function terminal() {
	const terminalField = document.querySelector('.editor-terminal-field');
	const editorInfo = document.querySelector('.editor-info-wrap');
	const inputTempRow = document.getElementById('editor-terminal-input-row');
	const infoTempl = document.querySelectorAll('.info-template');
	
	const tlInfo = gsap.timeline({
		defaults: {
			duration: 1.5,
			delay: .35,
		}
	});

	document.addEventListener('keyup', (event) => {
		if(event.target && event.target.classList.contains('editor-terminal-input-field', 'active')) {
			if(event.key === 'Enter' && !event.target.disabled) {
				const inputVal = event.target.value.toLowerCase();
				const elem = document.createElement('div');
				
				elem.classList.add('editor-terminal-row');

				event.target.disabled = true;
				event.target.classList.remove('active');

				if(inputVal === 'clear') {
					const infoField = document.querySelectorAll('.editor-field-info');
					
					if(infoField.length) {
						infoField.forEach(field => {
							let elemInfoFields = field.querySelectorAll('.editor-field-info-elem');

							field.remove();

							tlInfo.set(
								elemInfoFields,
								{opacity: '0'}
							);

							terminalField.appendChild(elem);
							elem.innerHTML = 'clearing info...'
						});
					} else {
						terminalField.appendChild(elem);
						elem.innerHTML = 'nothing to clear...'
					}
				} else if(inputVal === 'about' || inputVal === 'works' || inputVal === 'social') {
					if(!document.querySelector('.editor-field-info') || !document.getElementById(inputVal + '-info')) {
						terminalField.appendChild(elem);
						elem.innerHTML = 'show ' + inputVal + ' info...';
						
						infoTempl.forEach(elem => {
							if(elem.classList.contains(inputVal)) {							
								editorInfo.appendChild(elem.content.cloneNode(true));

								let elemField = editorInfo.querySelectorAll('.editor-field-info');
								console.log(elemField);
								
								elemField.forEach(field => {
									if(!field.classList.contains('created')) {
										field.style.opacity = '1';
										field.classList.add('created');
										const elemInfoFields = field.querySelectorAll('.editor-field-info-elem');
				
										tlInfo.to(
											elemInfoFields,
											{opacity: '1', stagger: .3}
										)
									}
								})
							}
						})
					} else {
						terminalField.appendChild(elem);
						elem.innerHTML = inputVal + ' info already exist...';
					}
				} else {
					terminalField.appendChild(elem);
					elem.innerHTML = 'info about ' + inputVal +  ' doesn`t exist';
				}
				
				terminalField.appendChild(inputTempRow.content.cloneNode(true));
				document.querySelector('.editor-terminal-input-field.active').focus();
			}
		}
	});
})();
