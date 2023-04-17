function hardLeft () {
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
        `)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 40)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 40)
    basic.pause(100)
}
function avoid () {
    fullStop()
    // Turn right and move forward to go around the obstacle
    softRight()
    basic.pause(500)
    // Move around the obstacle
    while (maqueen.Ultrasonic(PingUnit.Centimeters) < 30) {
        if (maqueen.Ultrasonic(PingUnit.Centimeters) < 10) {
            // If too close to the obstacle, turn right and move forward
            softRight()
            basic.pause(100)
        } else if (maqueen.Ultrasonic(PingUnit.Centimeters) > 20) {
            // If too far from the obstacle, turn left and move forward
            softLeft()
            basic.pause(100)
        } else {
            // If at a good distance from the obstacle, move forward
            fullForwards()
            basic.pause(100)
        }
        // If the robot cannot detect the object and can detect the line, stop avoiding
        LFSR = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
        LFSL = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
        if (maqueen.Ultrasonic(PingUnit.Centimeters) > 30 && (LFSL == 1 || LFSR == 1)) {
            break;
        }
    }
    // Turn left and move forward to align with the track
    softLeft()
    basic.pause(500)
}
function fullStop () {
    basic.showLeds(`
        . # # # .
        # . . . #
        # # # # #
        # . . . #
        . # # # .
        `)
    maqueen.motorStop(maqueen.Motors.All)
    basic.pause(100)
}
function softRight () {
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
        `)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 40)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 10)
}
function softLeft () {
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
        `)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 10)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 40)
}
function fullForwards () {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 40)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 40)
    basic.pause(100)
}
let avoiding = 0
let LFSL = 0
let LFSR = 0
// Turn left and move forward to align with the track
softLeft()
basic.pause(500)
basic.forever(function () {
    if (maqueen.Ultrasonic(PingUnit.Centimeters) < 10) {
        avoiding = 1
        avoid()
        LFSL = 0
    } else {
        avoiding = 0
        LFSR = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
        LFSL = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
        if (LFSL == 1 && LFSR == 1) {
            fullForwards()
        } else if (LFSL == 1) {
            softRight()
        } else if (LFSR == 1) {
            softLeft()
        } else {
            fullStop()
            basic.pause(100)
            hardLeft()
            basic.pause(100)
        }
    }
})
