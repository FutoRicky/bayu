[1mdiff --git a/public/javascripts/visualizer.js b/public/javascripts/visualizer.js[m
[1mindex eb698b4..1b4a8ae 100644[m
[1m--- a/public/javascripts/visualizer.js[m
[1m+++ b/public/javascripts/visualizer.js[m
[36m@@ -1,9 +1,6 @@[m
[31m-var State, svg;[m
[31m-var squares;[m
[31m-var WAVE_DATA;[m
[31m-var waveform_array, old_waveform, objectUrl, metaHide, micStream;       // raw waveform data from web audio api[m
[31m-var analyzers = [];[m
[31m-var waveform_array = [];[m
[32m+[m[32mvar State, svg, squares, WAVE_DATA,[m[41m [m
[32m+[m[32m    analyzers = [],[m
[32m+[m[32m    waveform_array = [];[m
 [m
 visualize = function() {[m
     State = {[m
[1mdiff --git a/public/stylesheets/style.css b/public/stylesheets/style.css[m
[1mindex 877be77..c2b6cfa 100644[m
[1m--- a/public/stylesheets/style.css[m
[1m+++ b/public/stylesheets/style.css[m
[36m@@ -1,7 +1,12 @@[m
 body {[m
[32m+[m[32m  background: black;[m
   font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;[m
 }[m
 [m
[32m+[m[32msvg rect.equal {[m
[32m+[m[32m  fill: white;[m
[32m+[m[32m}[m
[32m+[m
 a {[m
   color: #00B7FF;[m
 }[m
