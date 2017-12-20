
var labels = new Map();
var exporter = {};
const performer = performance;
export function start(label){
    if(!labels.has(label)){
        labels.set(label,performer.now());
        return;
    }
    throw new Error("Key already exists. Try restarting the key.");
}

export function end(label){
    if(labels.has(label)){
        var curValue = performer.now();
        var prevValue = labels.get(label);
        var diff = curValue - prevValue; // This is the time elapesed in milliseconds.
        labels.delete(label);
        console.log('Completed ' + label + ' in ' + diff + ' ms');
        return diff;
    }
    throw new Error("Key does not exist. Start a timer first.");
}

export function restart(label){
    if(!labels.has(label)){
        throw new Error("Key does not exist. Start a timer first.");
    }
    labels(label,performer.now());
}

// exporter.start = start;
// exporter.end = end;
// exporter.restart = restart;

// export {default as Exporter};