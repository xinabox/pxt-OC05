/**
 * OC05 Servo Driver
 */
//% weight=99 color=#000000 icon="\uf085"
//% groups='["Positional", "Continuous", "Configuration"]'
namespace OC05 {
    const PCA9685_I2C_ADDRESS = 0x78
    const PCA9685_PRESCALE = 0xFE
    const PCA9685_MODE1 = 0x00
    const modeRegister1Default = 0x01
    const PCA9685_MODE2 = 0x01
    const modeRegister2Default = 0x04
    const PCA9685_SLEEP = modeRegister1Default | 0x10;
    const PCA9685_WAKE = modeRegister1Default & 0xEF;
    const PCA9685_RESTART = PCA9685_WAKE | 0x80;
    const PCA9685_ALLON_L = 0xFA
    const PCA9685_ALLON_H = 0xFB
    const PCA9685_ALLOFF_L = 0xFC
    const PCA9685_ALLOFF_H = 0xFD
    const PCA9685_CHAN8_ON_L = 0x26
    const PCA9685_CHAN8_ON_H = 0x27
    const PCA9685_CHAN8_OFF_L = 0x28
    const PCA9685_CHAN8_OFF_H = 0x29

    export enum PinNum {
        Pin0 = 0,
        Pin1 = 1,
        Pin2 = 2,
        Pin3 = 3,
        Pin4 = 4,
        Pin5 = 5,
        Pin6 = 6,
        Pin7 = 7,
    }

    export enum ServoNum {
        Servo1 = 1,
        Servo2 = 2,
        Servo3 = 3,
        Servo4 = 4,
        Servo5 = 5,
        Servo6 = 6,
        Servo7 = 7,
        Servo8 = 8,
    }

    export class ServoConfigObject {
        id: number;
        pinNumber: number;
        minOffset: number;
        midOffset: number;
        maxOffset: number;
        position: number;
    }


    const buf = pins.createBuffer(2)
    const prescaler = calcFreqPrescaler(60)
    write(PCA9685_I2C_ADDRESS, PCA9685_MODE1, PCA9685_SLEEP)
    write(PCA9685_I2C_ADDRESS, PCA9685_PRESCALE, prescaler)
    write(PCA9685_I2C_ADDRESS, PCA9685_ALLON_L, 0x00)
    write(PCA9685_I2C_ADDRESS, PCA9685_ALLON_H, 0x00)
    write(PCA9685_I2C_ADDRESS, PCA9685_ALLOFF_L, 0x00)
    write(PCA9685_I2C_ADDRESS, PCA9685_ALLOFF_H, 0x00)
    write(PCA9685_I2C_ADDRESS, PCA9685_MODE1, PCA9685_WAKE)
    control.waitMicros(1000)
    write(PCA9685_I2C_ADDRESS, PCA9685_MODE1, PCA9685_RESTART)

    export const DefaultServoConfig = new ServoConfigObject();
    DefaultServoConfig.pinNumber = -1
    DefaultServoConfig.minOffset = 5
    DefaultServoConfig.midOffset = 15
    DefaultServoConfig.maxOffset = 25
    DefaultServoConfig.position = 90

    export class ServoConfig {
        id: number;
        pinNumber: number;
        minOffset: number;
        midOffset: number;
        maxOffset: number;
        position: number;
        constructor(id: number, config: ServoConfigObject) {
            this.id = id
            this.init(config)
        }

        init(config: ServoConfigObject) {
            this.pinNumber = config.pinNumber > -1 ? config.pinNumber : this.id - 1
            this.setOffsetsFromFreq(config.minOffset, config.maxOffset, config.midOffset)
            this.position = -1
        }

        setOffsetsFromFreq(startFreq: number, stopFreq: number, midFreq: number = -1): void {
            this.minOffset = startFreq // calcFreqOffset(startFreq)
            this.maxOffset = stopFreq // calcFreqOffset(stopFreq)
            this.midOffset = midFreq > -1 ? midFreq : ((stopFreq - startFreq) / 2) + startFreq
        }

        config(): string[] {
            return [
                'id', this.id.toString(),
                'pinNumber', this.pinNumber.toString(),
                'minOffset', this.minOffset.toString(),
                'maxOffset', this.maxOffset.toString(),
                'position', this.position.toString(),
            ]
        }
    }

    export class ChipConfig {
        address: number;
        servos: ServoConfig[];
        freq: number;
        constructor(address: number = PCA9685_I2C_ADDRESS, freq: number = 50) {
            this.address = address
            this.servos = [
                new ServoConfig(1, DefaultServoConfig),
                new ServoConfig(2, DefaultServoConfig),
                new ServoConfig(3, DefaultServoConfig),
                new ServoConfig(4, DefaultServoConfig),
                new ServoConfig(5, DefaultServoConfig),
                new ServoConfig(6, DefaultServoConfig),
                new ServoConfig(7, DefaultServoConfig),
                new ServoConfig(8, DefaultServoConfig),
            ]
            this.freq = freq
            const buf = pins.createBuffer(2)
            const prescaler = calcFreqPrescaler(60)
            write(PCA9685_I2C_ADDRESS, PCA9685_MODE1, PCA9685_SLEEP)
            write(PCA9685_I2C_ADDRESS, PCA9685_PRESCALE, prescaler)
            write(PCA9685_I2C_ADDRESS, PCA9685_ALLON_L, 0x00)
            write(PCA9685_I2C_ADDRESS, PCA9685_ALLON_H, 0x00)
            write(PCA9685_I2C_ADDRESS, PCA9685_ALLOFF_L, 0x00)
            write(PCA9685_I2C_ADDRESS, PCA9685_ALLOFF_H, 0x00)
            write(PCA9685_I2C_ADDRESS, PCA9685_MODE1, PCA9685_WAKE)
            control.waitMicros(1000)
            write(PCA9685_I2C_ADDRESS, PCA9685_MODE1, PCA9685_RESTART)
        }
    }

    export const chips: ChipConfig[] = []

    function calcFreqPrescaler(freq: number): number {
        return (25000000 / (freq * 4096)) - 1;
    }

    function write(chipAddress: number, register: number, value: number): void {
        const buffer = pins.createBuffer(2)
        buffer[0] = register
        buffer[1] = value
        pins.i2cWriteBuffer(chipAddress, buffer, false)
    }

    export function getChipConfig(address: number): ChipConfig {
        for (let i = 0; i < chips.length; i++) {
            if (chips[i].address === address) {

                return chips[i]
            }
        }
        const chip = new ChipConfig(address)
        const index = chips.length
        chips.push(chip)
        return chips[index]
    }

    function calcFreqOffset(freq: number, offset: number) {
        return ((offset * 1000) / (1000 / freq) * 4096) / 10000
    }

    function setPinPulseRange(pinNumber: PinNum = 0, onStep: number = 0, offStep: number = 2048, chipAddress: number = PCA9685_I2C_ADDRESS): void {
        pinNumber = Math.max(0, Math.min(7, pinNumber))
        const buffer2 = pins.createBuffer(2)
        const pinOffset = 4 * pinNumber
        onStep = Math.max(0, Math.min(4095, onStep))
        offStep = Math.max(0, Math.min(4095, offStep))

        // Low byte of onStep
        write(chipAddress, pinOffset + PCA9685_CHAN8_ON_L, onStep & 0xFF)

        // High byte of onStep
        write(chipAddress, pinOffset + PCA9685_CHAN8_ON_H, (onStep >> 8) & 0x0F)

        // Low byte of offStep
        write(chipAddress, pinOffset + PCA9685_CHAN8_OFF_L, offStep & 0xFF)

        // High byte of offStep
        write(chipAddress, pinOffset + PCA9685_CHAN8_OFF_H, (offStep >> 8) & 0x0F)
    }

    function degrees180ToPWM(freq: number, degrees: number, offsetStart: number, offsetEnd: number): number {
        // Calculate the offset of the off point in the freq
        offsetEnd = calcFreqOffset(freq, offsetEnd)
        offsetStart = calcFreqOffset(freq, offsetStart)
        const spread: number = offsetEnd - offsetStart
        const calcOffset: number = ((degrees * spread) / 180) + offsetStart
        // Clamp it to the bounds
        return Math.max(offsetStart, Math.min(offsetEnd, calcOffset))
    }

    /**
     * Used to move the given servo to the specified degrees (0-180) connected to the PCA9685
     */
    //% block="OC05 set servo %servoNum to %degrees degrees"
    //% servoNum.defl=OC05.ServoNum.Servo1 degrees.defl=90 degrees.min=0 degrees.max=180
    //% group="Positional"
    export function setServoPosition(servoNum: ServoNum, degrees: number): void {
        const chip2 = getChipConfig(PCA9685_I2C_ADDRESS)
        servoNum = Math.max(1, Math.min(8, servoNum))
        degrees = Math.max(0, Math.min(180, degrees))
        const servo: ServoConfig = chip2.servos[servoNum - 1]
        const pwm = degrees180ToPWM(chip2.freq, degrees, servo.minOffset, servo.maxOffset)
        servo.position = degrees
        return setPinPulseRange(servo.pinNumber, 0, pwm, PCA9685_I2C_ADDRESS)
    }

    /**
     * Used to set the rotation speed of a continous rotation servo from -100% to 100%
     */
    //% block="OC05 continuous servo %servoNum run at speed %speed| %"
    //% servoNum.defl=OC05.ServoNum.Servo1 speed.defl=50 speed.min=-100 speed.max=100
    //% group="Continuous"
    export function setCRServoPosition(servoNum: ServoNum, speed: number): void {
        const chip3 = getChipConfig(PCA9685_I2C_ADDRESS)
        const freq = chip3.freq
        servoNum = Math.max(1, Math.min(8, servoNum))
        const servo2: ServoConfig = chip3.servos[servoNum - 1]
        const offsetStart = calcFreqOffset(freq, servo2.minOffset)
        const offsetMid = calcFreqOffset(freq, servo2.midOffset)
        const offsetEnd = calcFreqOffset(freq, servo2.maxOffset)
        if (speed === 0) {
            return setPinPulseRange(servo2.pinNumber, 0, offsetMid, PCA9685_I2C_ADDRESS)
        }
        const isReverse: boolean = speed < 0
        const spread2 = isReverse ? offsetMid - offsetStart : offsetEnd - offsetMid
        servo2.position = speed
        speed = Math.abs(speed)
        const calcOffset2: number = ((speed * spread2) / 100)
        const pwm2 = isReverse ? offsetMid - calcOffset2 : offsetMid + calcOffset2
        return setPinPulseRange(servo2.pinNumber, 0, pwm2, PCA9685_I2C_ADDRESS)
    }


    /**
     * Used to stop continuous servo motor at current position
    */
    //% block="OC05 stop servo %servo"
    //% servoNum.defl=OC05.ServoNum.Servo1
    //% group="Continuous"
    export function stopServo(servoNum: ServoNum): void {
        const chip3 = getChipConfig(PCA9685_I2C_ADDRESS)
        const freq = chip3.freq
        servoNum = Math.max(1, Math.min(8, servoNum))
        const servo2: ServoConfig = chip3.servos[servoNum - 1]
        const offsetStart = calcFreqOffset(freq, servo2.minOffset)
        const offsetMid = calcFreqOffset(freq, servo2.midOffset)
        const offsetEnd = calcFreqOffset(freq, servo2.maxOffset)

        return setPinPulseRange(servo2.pinNumber, 0, offsetMid, PCA9685_I2C_ADDRESS)

    }

    /**
     * Used to set the range in degrees to control the connected servo
     */
    //% block="OC05 set servo %servoNum range from %minimum to %maximum"
    //% minimum.defl=0 maximum.defl=180
    //% servoNum.defl=OC05.ServoNum.Servo1
    //% group="Configuration"
    export function setServoLimits(servoNum: ServoNum, minimum: number, maximum: number): void {

        let minTimeCs: number = Math.map(minimum, 0, 180, 5, 25)
        let maxTimeCs: number = Math.map(maximum, 0, 180, 5, 25)
        let midTimeCs: number = 15
        const chip4 = getChipConfig(PCA9685_I2C_ADDRESS)
        servoNum = Math.max(1, Math.min(8, servoNum))
        minTimeCs = Math.max(0, minTimeCs)
        maxTimeCs = Math.max(0, maxTimeCs)
        const servo3: ServoConfig = chip4.servos[servoNum - 1]
        midTimeCs = midTimeCs > -1 ? midTimeCs : ((maxTimeCs - minTimeCs) / 2) + minTimeCs
        return servo3.setOffsetsFromFreq(minTimeCs, maxTimeCs, midTimeCs)
    }

}
