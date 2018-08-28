# pxt-OC05

This is the MakeCode Package for the OC05 xChip.

## Getting Started

1. Open [Microsoft MakeCode for micro:bit](https://makecode.microbit.org)
2. Select *Advanced > Add Package* in the toolbox
3. Copy and paste *https://github.com/xinabox/pxt-OC05* in the search and click search
4. Select the package by clicking on it

## Blocks



## Example Usage

```
input.onButtonPressed(Button.A, () => {
    PCA9685.setServoPosition(PCA9685.ServoNum.Servo1, 0)
    basic.showString("A")
})
input.onButtonPressed(Button.B, () => {
    PCA9685.setServoPosition(PCA9685.ServoNum.Servo1, 180)
    basic.showString("B")
})
input.onButtonPressed(Button.AB, () => {
    PCA9685.setServoPosition(PCA9685.ServoNum.Servo1, 90)
    basic.showString("C")
})
PCA9685.init()
```

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

