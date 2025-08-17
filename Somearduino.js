class ArduinoNanoExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.ws = null;
        this.connected = false;
    }

    getInfo() {
        return {
            id: 'arduinonano',
            name: 'Arduino Nano',
            blocks: [
                {
                    opcode: 'readLight',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'light sensor A0',
                },
                {
                    opcode: 'setMotor',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set motor [STATE]',
                    arguments: {
                        STATE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'motorStates'
                        }
                    }
                }
            ],
            menus: {
                motorStates: {
                    items: ['ON', 'OFF']
                }
            }
        };
    }

    // Called when Scratch loads the extension
    connect() {
        if (this.connected) return;
        this.ws = new WebSocket("ws://127.0.0.1:20110/scratch/firmata"); 
        this.ws.onopen = () => {
            console.log("Connected to Scratch Link!");
            this.connected = true;
        };
        this.ws.onclose = () => {
            this.connected = false;
            console.log("Lost connection to Scratch Link.");
        };
    }

    readLight() {
        this.connect();
        // Request analog pin A0
        this.ws.send(JSON.stringify({
            type: "firmata",
            command: "analogRead",
            pin: 0
        }));

        // For demo, just return a fake number until we handle responses
        return Math.floor(Math.random() * 1023);
    }

    setMotor(args) {
        this.connect();
        const state = args.STATE === 'ON' ? 1 : 0;
        this.ws.send(JSON.stringify({
            type: "firmata",
            command: "digitalWrite",
            pin: 3,
            value: state
        }));
    }
}

Scratch.extensions.register(new ArduinoNanoExtension());
