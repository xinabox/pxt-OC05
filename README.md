# pxt-OC05

This is the MakeCode Package for the OC05 xChip.

## Getting Started

1. Open [Microsoft MakeCode for micro:bit](https://makecode.microbit.org).
2. Select *Advanced > Add Package* in the toolbox.
3. Copy and paste **https://github.com/xinabox/pxt-OC05** in the search bar and click search
4. Select the package by clicking on it. The package will appear along with the existing packages in the toolbox.

## Blocks

### init
```typescript
init(chipi2cAddress: number, frequency: number)
```
Configures the OC05 to prepare it for use with a servo
* chipI2cAddress: i2c address of the PCA9685
* frequency     : frequency (40-1000) in hertz to run the clock cycle at

### reset
```typescript
reset(chipi2cAddress: number)
```
Resets PCA9685 and retains the frequency. All outputs turned off.
* chipI2cAddress: i2c address of the PCA9685

### setServoPosition

```typescript
setServoPosition(servoChannel: number, degrees: number, chipi2cAddress: number)
```
Positions a servo on the selected channel a desired degree of rotation.
* servoChannel: the channel number on the OC05 (1 - 8)
* degrees: desired degree of rotation
* chipI2cAddress: i2c address of the PCA9685

### setCRServoPosition

```typescript
setCRServoPosition()
```

### setServoLimits
```typescript
setServoLimits()
```

## Example Usage

```
input.onButtonPressed(Button.A, () => {
    OC05.setServoPosition(OC05.ServoNum.Servo1, 0, 120)
    basic.showString("A")
})
input.onButtonPressed(Button.B, () => {
    OC05.setServoPosition(OC05.ServoNum.Servo1, 180, 120)
    basic.showString("B")
})
input.onButtonPressed(Button.AB, () => {
    OC05.setServoPosition(OC05.ServoNum.Servo1, 90, 120)
    basic.showString("C")
})
OC05.init(120, 50)
```

## License

MIT

## Supported targets

* for PXT/microbit
```package
OC05=github:xinabox/pxt-OC05
```

