// --------------------------------------------------------------------------
// postit.js v1.0
// written by: Benjamin Keen, August 2003
// --------------------------------------------------------------------------
// For an explanation of the script, see attached example.html, or visit 
// benjaminkeen.com


/* ------------------------------------------------------------------------*/
// CONFIGURATION SETTINGS

// Default styles
var postitStyles = new Object();

postitStyles = {
  'width':                  '200',
  'height':                 'auto',   
  'backgroundColor':        '#FFFFCC',
  'fontFamily':             'verdana', 
  'fontSize':               '8pt', 
	
  'padding':                '2px',
  'border':                 '1px solid #999999',
  'position':               'absolute'
}

var _x_offset = 10;      // num of pixels horizontally offset from mouse click   
var _y_offset = 10;      // num of pixels vertically offset from mouse click 

/* ------------------------------------------------------------------------*/



// --------------------------------------------------------------------------
// function:    initializePostits() 
// description: called by body onload handler. This automatically hides all 
//              post-its on the page. Post-its are identified by having an 
//              id with this format: id="postitX" - where X is any integer. 
// --------------------------------------------------------------------------
function initializePostits() {

  // find all post-its 
	var postits = document.getElementsByTagName('div');
	var postitElementsArray = new Array();         // stores id's of all post-its

	for (i=0; i<postits.length; i++) {
    if (postits[i].id.match(/^postit/i)) { 
		  postitElementsArray.push(postits[i].id);
		}
	}
		
	// hide all post-its
  for (i=0; i<postitElementsArray.length; i++) {
	  document.getElementById(postitElementsArray[i]).style.display = "none";
	}

	
	// set default post-it styles. Individual post-it styles may be overridden 
	// later by showPostit()
	for (styleName in postitStyles) {

		// set style for each unique postit
    for (i=0; i<postitElementsArray.length; i++) {
			document.getElementById(postitElementsArray[i]).style[styleName] = postitStyles[styleName]; 
	  }
		
	}
}


// --------------------------------------------------------------------------
// function:    currentMousePosition()
// description: helper function to store location of mouse in global var
//              so we can access those values in Netscape 
// --------------------------------------------------------------------------
window.onmousemove = currentMousePosition;
var _x;       // global var to keep track of x mouse co-ordinate
var _y;       // global var to keep track of y mouse co-ordinate

function currentMousePosition(e) {  
  if (document.layers || document.getElementById&&!document.all) { 
	  _x = e.pageX;
		_y = e.pageY;
  } 
} 


// --------------------------------------------------------------------------
// function:    showPostit()
// parameters:  - postitId: the unique id of the post-it (required)
//              - quadrant: 1=top-left, 2=top-right, 3=bottom-left, 4=bottom-right
//                          if 'null' uses default (optional)
//              - w:        width of post-it. if 'null' uses default (optional)
//              - h:        height of post-it. if 'null' uses default (optional)
//              - bc:       background color. if 'null' uses default (optional)
// --------------------------------------------------------------------------
function showPostit(postitId, quadrant, w, h, bc) {

	// Find x & y mouse location to figure out where to display the post-it
  var isIE = document.all ? true : false;	
	var x_coord = isIE ? event.clientX + document.body.scrollLeft : _x;
	var y_coord = isIE ? event.clientY + document.body.scrollTop  : _y;

	var postitStyle = document.getElementById(postitId).style;
	
	// custom post-it size
	if (w) { postitStyle.width = w;	}
	if (h) { postitStyle.height = h;	}
	
	
  // toggle post-it visibility 
  if (postitStyle.display && postitStyle.display != 'none') { 
	  postitStyle.display = 'none';	
	}
	else { postitStyle.display = 'block'; }

	
	// calculate location of post-it. We do this *after* making it visible, since 
	// we can't ascertain the height of an element with 'auto' size unless it is 
	// visible. 
	var new_x_coord = x_coord + _x_offset;
	var new_y_coord = y_coord + _y_offset;

	var psw = Number(postitStyle.width.replace(/\D/g, ""));
	var psh = Number(postitStyle.height.replace(/\D/g, ""));
	
  if (psh == 0) { psh = document.getElementById(postitId).offsetHeight; }

  switch (quadrant) {
	  case 1:                            // top-left
		  new_x_coord = x_coord - (psw + _x_offset);
		  new_y_coord = y_coord - (psh + _y_offset);
		  break;
		case 2:                            // top-right
		  new_x_coord = x_coord + _x_offset;
		  new_y_coord = y_coord - (psh + _y_offset);
		  break;		
		case 3:                            // bottom-left
		  new_x_coord = x_coord - (psw + _x_offset);
		  new_y_coord = y_coord + _y_offset;
		  break;		
		case 4:                            // bottom-right
		  new_x_coord = x_coord + _x_offset;
		  new_y_coord = y_coord + _y_offset;		
		  break;
	} 
	
  postitStyle.top  = new_y_coord;
  postitStyle.left = new_x_coord;

	// set the color
	if (bc) { postitStyle.backgroundColor = bc; }
	
	return false;

}