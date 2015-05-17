/**
 * Created by Andres on 13/05/2015...
 */
var inputs = [];
var outputs = [0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0];

var results = ["0", "1", "2", "3", "4", "5",
    "6", "7", "8", "9", "A", "B",
    "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"];

var training_set = [];
var W1 = [];
var W2 = [];
var inputs_layer_neurons = 25; //25
var hidden_layer_neurons = 41; //31
var output_layer_neurons = 36; //36
var hidden_layer = [];
var output_layer = [];
var alpha = 0.9; //0.6
var unbalanced = true;

function calculate_results(){
    var greater = 0;
    var listindex = [];
    var index = 0;

    for(var i = 0; i < output_layer.length; i++){
        if(output_layer[i] > greater){
            greater = output_layer[i];
            listindex.push(i);
            index = i;
        }
    }
    return results[index];
}

function variable_initialization(){
    var weights = [];
    var max = 2;
    var min = -2;
    for(var i = 0; i < hidden_layer_neurons; i++){
        weights = [];
        for(var j = 0; j < inputs_layer_neurons; j++){
            weights.push(Math.random() * (max - min) + min);
        }
        W1.push(weights);
    }
    for(var x = 0; x < output_layer_neurons; x++){
        weights = [];
        for(var y = 0; y < hidden_layer_neurons; y++){
            weights.push(Math.random() * (max - min) + min);
        }
        W2.push(weights);
    }
}

function sigmoid(z){
    return 1.0/(1.0+(Math.pow(Math.E, (z*-1))));
}

function feed_foward(input, Tphase){
    hidden_layer = [];
    output_layer = [];
    for (var i = 0; i < hidden_layer_neurons; i++) {
        var hidden_input = 0;
        for(var j = 0; j < input.length; j++){
            hidden_input += W1[i][j] * input[j];
        }
        hidden_layer.push(sigmoid(hidden_input));
    }

    for(var x = 0; x < output_layer_neurons; x++){
        var output_layer_input = 0;
        for(var y = 0; y < hidden_layer_neurons; y++){
            output_layer_input += W2[x][y] * hidden_layer[y];
        }
        output_layer.push(sigmoid(output_layer_input));
    }
    inputs = input;
    if(Tphase){
        back_propagation();
    }
    else{
        console.log(output_layer);
        console.log("show result: ", calculate_results());
    }
}

function copy_array(array){
    var na = [];
    for(var i = 0; i < array.length; i++){
        na.push([]);
        for(var j = 0; j < array[i].length; j++){
            na[i].push(array[i][j]);
        }
    }
    return na;
}

function back_propagation(){
    var nw2 = copy_array(W2);
    for(var i = 0; i < output_layer.length; i++){
        var output = output_layer[i];
        if((outputs[i] === 1 && output < 0.9) || (outputs[i] === 0 && output > 0.1)){
            unbalanced = true;
            var delta = output * (1 - output) * (outputs[i] - output);
            for(var j = 0; j < nw2[i].length; j++){
                nw2[i][j] = W2[i][j] + alpha * hidden_layer[j] * delta;
            }
            for(var x = 0; x < W1.length; x++){
                var delta2 = hidden_layer[x] * (1 - hidden_layer[x]) * (W2[i][x] * delta);
                for(var y = 0; y < W1[x].length; y++){
                    var temp = W1[x][y];
                    W1[x][y] = temp + alpha * inputs[y] * delta2;
                }
            }
        }
    }
    W2 = copy_array(nw2);
}

function toByteArray(input){
    var result = [];
    for(var i = 0; i < input.length; i+=4){
        if(input[i] == 255){
            result.push(0);
        }else{
            result.push(1);
        }
    }
    return result;
}

function load_images(){
    var canvas = document.getElementById("myCanvas"),
        canvasContext = canvas.getContext("2d");
    for(var i = 0; i < 36; i++){
        var myImg = new Image();
        //myImg.crossOrigin = 'anonymous';

        myImg.onload = (function(value){
            return function(){
                canvas.width = this.width;
                canvas.height = this.height;

                canvasContext.drawImage(this, 0, 0, this.width, this.height);
                var imgData = canvasContext.getImageData(0, 0, 5, 5).data;

                //console.log(value);
                //console.log(toByteArray(imgData));
                training_set.push(toByteArray(imgData));
            }
        })(i);

        myImg.src = './training/Sample'+i.toString()+'.png';
    }
}

function training(){
    //var x = 0;
    //while(unbalanced){
    for(var x = 0; x < 6000; x++){
        if(x % 100 === 0){
            console.log('Iteration: ', x);
        }
        unbalanced = false;
        for(var i = 0; i < 36; i++) {
            outputs[i] = 1;
            feed_foward(training_set[i], true);
            outputs[i] = 0;
        }
        x += 1;
    }
    console.log("Done training");
}

function train(){
    variable_initialization();
    training();
}

function test(){
    outputs[0] = 1;
    feed_foward([1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0], false);
    outputs[0] = 0;
}

load_images();
/*W1 = [[0.1, -0.7], [0.5, 0.3]];
W2 = [[0.2, 0.4]];
outputs[0] = 1;
feed_foward([0, 1], true);
console.log(W2);
console.log(W1);*/