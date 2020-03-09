[![GitHub Issues](https://img.shields.io/github/issues/xinabox/pxt-OC05.svg)](https://github.com/xinabox/pxt-OC05/issues) 
![GitHub Commit](https://img.shields.io/github/last-commit/xinabox/pxt-OC05) 
![Maintained](https://img.shields.io/maintenance/yes/2020) 
![Build status badge](https://github.com/xinabox/pxt-OC05/workflows/maker/badge.svg)
![Build status badge](https://github.com/xinabox/pxt-OC05/workflows/microbit/badge.svg)
# pxt-OC05

This is the MakeCode Package for the OC05 xChip.

## Getting Started

1. Open [Microsoft MakeCode for micro:bit](https://makecode.microbit.org).
2. Select *Advanced > Add Package* in the toolbox.
3. Copy and paste **https://github.com/xinabox/pxt-OC05** in the search bar and click search
4. Select the package by clicking on it. The package will appear along with the existing packages in the toolbox.

## Blocks

### setServoPosition

```typescript
setServoPosition(servoChannel: number, degrees: number)
```
Positions a servo on the selected channel a desired degree of rotation.
* servoChannel: the channel number on the OC05 (1 - 8)
* degrees: desired degree of rotation

### setCRServoPosition

```typescript
setCRServoPosition(servoChannel: number, speed: number)
```
Rotates a servo on the selected channel with desired percent of speed 
* servoChannel: the channel number on the OC05 (1 - 8)
* speed: percent of speed to rotate (-100% - 100%)

### setServoLimits
```typescript
setServoLimits(servoChannel: number, minimum: number, maximum: number)
```
Bound servo motor movement within maximum and minimum degrees entered
* servoChannel: the channel number on the OC05 (1 - 8)
* minimum: lower limit of servo movement in degrees
* maximum: upper limit of servo movement in degrees

## Example Usage

```
input.onButtonPressed(Button.A, () => {
    OC05.setServoPosition(OC05.ServoNum.Servo1, 0)
    basic.showString("A")
})
input.onButtonPressed(Button.B, () => {
    OC05.setServoPosition(OC05.ServoNum.Servo1, 180)
    basic.showString("B")
})
input.onButtonPressed(Button.AB, () => {
    OC05.setServoPosition(OC05.ServoNum.Servo1, 90)
    basic.showString("C")
})
```

## License

MIT

## Supported targets

* for PXT/microbit
```package
OC05=github:xinabox/pxt-OC05
```

