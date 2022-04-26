define("ace/theme/humdrum_mcl_light",["require","exports","module","ace/lib/dom"],function(e,t,n) {
  t.isDark=false,
  t.cssClass="ace-humdrum-mcl-light",
  t.cssText= `

.ace-humdrum-mcl-light .ace_gutter {background: var(--theme-color8);color: #910ACF}
.ace-humdrum-mcl-light .ace_print-margin {width: 1px;background: #e8e8e8}
.ace-humdrum-mcl-light {background-color: rgba(160, 230, 210, 0.1);color: black}

.ace-humdrum-mcl-light .ace_cursor.focused {color: #d30102 !important}
.ace-humdrum-mcl-light .ace_cursor.blurred {color: goldenrod !important}

/*
.ace-humdrum-mcl-light .ace_hidden-cursors .ace_cursor.blurred {
	opacity: 1.0;
	color: goldenrod;
}
*/

.ace-humdrum-mcl-light .ace_marker-layer .ace_selection {background: rgba(7, 54, 67, 0.09)}
.ace-humdrum-mcl-light.ace_multiselect .ace_selection.ace_start {box-shadow: 0 0 3px 0px #FDF6E3;}
.ace-humdrum-mcl-light .ace_marker-layer .ace_step {background: rgb(255, 255, 0)}
.ace-humdrum-mcl-light .ace_marker-layer .ace_bracket {margin: -1px 0 0 -1px;border: 1px solid rgba(147, 161, 161, 0.50)}
.ace-humdrum-mcl-light .ace_marker-layer .ace_active-line {background: #EEf3D5}
.ace-humdrum-mcl-light .ace_gutter-active-line {background-color : #EDE5C1}
.ace-humdrum-mcl-light .ace_marker-layer .ace_selected-word {border: 1px solid #073642}
.ace-humdrum-mcl-light .ace_invisible {color: rgba(147, 161, 161, 0.50)}
.ace-humdrum-mcl-light .ace_universal {color: green; background: rgba(255,0,0,0.25)}
.ace-humdrum-mcl-light .ace_bibliographic {color: green}
.ace-humdrum-mcl-light .ace_filter {color: limegreen}
.ace-humdrum-mcl-light .ace_filter.ace_used {color: olive}
.ace-humdrum-mcl-light .ace_exinterp {color: red}
.ace-humdrum-mcl-light .ace_terminator {color: red}
.ace-humdrum-mcl-light .ace_manip {color: magenta}
.ace-humdrum-mcl-light .ace_interp {color: darkviolet}
.ace-humdrum-mcl-light .ace_label {color: darkviolet; background: rgba(75,0,130,0.3)}
.ace-humdrum-mcl-light .ace_comment {color: #2fc584}
.ace-humdrum-mcl-light .ace_unknown {color: darkgoldenrod}
.ace-humdrum-mcl-light .ace_comment.ace_global {color: blue}
.ace-humdrum-mcl-light .ace_comment.ace_layout {color: orange}
.ace-humdrum-mcl-light .ace_barline {color: gray; background: rgba(0, 0, 0, 0.06)}
.ace-humdrum-mcl-light .ace_invalid.ace_tab {background-color: red}
.ace-humdrum-mcl-light .ace_invalid.ace_space {background-color: blue}
.ace-humdrum-mcl-light .ace_kern.ace_note {color: black; font-weight:bold}
.ace-humdrum-mcl-light .ace_kern.ace_other {color: brown}
.ace-humdrum-mcl-light .ace_kern.ace_duration {color: gray}
.ace-humdrum-mcl-light .ace_dot {color: gray}
.ace-humdrum-mcl-light .ace_fold {background-color: #268BD2;border-color: #586E75}
.ace-humdrum-mcl-light .ace_indent-guide {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHjy8NJ/AAjgA5fzQUmBAAAAAElFTkSuQmCC) right repeat-y}

`;
  var r=e("../lib/dom");r.importCssString(t.cssText,t.cssClass)
})
