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
var W1 = [];
var W2 = [];
var inputs_layer_neurons = 25; //225
var hidden_layer_neurons = 41; //174
var output_layer_neurons = 36; //36
var hidden_layer = [];
var output_layer = [];
var alpha = 0.25; //0.6

function calculate_results(){
    var greater = 0;
    var listindex = [];
    var index = 0;

    for(i = 0; i < output_layer.length; i++){
        if(output_layer[i] > greater){
            greater = output_layer[i];
            listindex.push(i);
            index = i;
        }
    }
    return results[index];
}

function variable_initialization(){
    for(x = 0; x < hidden_layer_neurons; x++){
        var weights = [];
        for(y = 0; y < inputs_layer_neurons; y++){
            weights.push(Math.random());
        }
        W1.push(weights);
    }
    for(x = 0; x < output_layer_neurons; x++){
        var weights = [];
        for(y = 0; y < hidden_layer_neurons; y++){
            weights.push(Math.random());
        }
        W2.push(weights);
    }
}

function sigmoid(z){
    return 1.0/(1.0+(Math.pow(Math.E, (z*-1))));
}

function feed_foward(input, Tphase){
    for (x = 0; x < hidden_layer_neurons; x++) {
        var hidden_input = 0;
        for(y = 0; y < input.length; y++){
            hidden_input += W1[x][y] * input[y];
        }
        hidden_layer.push(sigmoid(hidden_input));
    }

    for(x = 0; x < output_layer_neurons; x++){
        var output_layer_input = 0;
        for (y = 0; y < hidden_layer_neurons; y++){
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

function back_propagation(){
    var nw2 = W2.slice();
    for(i = 0; i < output_layer.length; i++){
        var output = output_layer[i];
        if(outputs[i] === 1 && output < 0.8 || outputs[i] === 0 && output > 0.2){
            var delta = output * (1 - output) * (outputs[i] - output);
            for(y = 0; y < nw2[i].length; y++){
                nw2[i][y] = nw2[i][y] + alpha * hidden_layer[y] * delta;
            }
            for(x = 0; x < W1.length; x++){
                delta2 = hidden_layer[x] * (1 - hidden_layer[x]) * (W2[i][x] * delta);
                for(z = 0; z < W1[x].length; z++){
                    W1[x][z] = W1[x][z] + alpha * inputs[z] * delta2;
                }
            }
        }
    }
    W2 = nw2.slice();
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

function training(){
    var canvas = document.getElementById("myCanvas"),
        canvasContext = canvas.getContext("2d");
    for(var i = 0; i < 36; i++){
        var myImg = new Image();
        //myImg.crossOrigin = 'anonymous';

        // create an empty canvas element
        /*myImg.onload = function() {
            canvas.width = this.width;
            canvas.height = this.height;

            canvasContext.drawImage(this, 0, 0, this.width, this.height);
            var imgData = canvasContext.getImageData(0, 0, 5, 5).data;
            console.log(i);
            console.log(imgData);
        };*/

        myImg.onload = (function(value){
            return function(){
                canvas.width = this.width;
                canvas.height = this.height;

                canvasContext.drawImage(this, 0, 0, this.width, this.height);
                var imgData = canvasContext.getImageData(0, 0, 5, 5).data;
                feed_foward(toByteArray(imgData), true);
            }
        })(i);

        myImg.src = './training/Sample'+i.toString()+'.png';
    }
}

variable_initialization();
training();
feed_foward(toByteArray([255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255]), false);

/*W1 = [[0.1, -0.7], [0.5, 0.3]];
W2 = [[0.2, 0.4]];
outputs[0] = 1;
feed_foward([0, 1], true);
console.log(W2);
console.log(W1);*/