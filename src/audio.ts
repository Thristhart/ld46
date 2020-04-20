import gameOverSrc from "@assets/epic_fail.mp3";
import fallingSrc from "@assets/falling.mp3";
import leftDownSrc from "@assets/LFlipDwn.wav";
import leftUpSrc from "@assets/LFlipUp.wav";
import pinballHitSrc from "@assets/pinball_hit.wav";
import rightDownSrc from "@assets/RFlipDwn.wav";
import rightUpSrc from "@assets/RFlipUp.wav";
import bgMusicSrc from "@assets/rock and roll baby.mp3";
import splashSrc from "@assets/splash.mp3";
import victorySrc from "@assets/victory.mp3";
import { CollisionDescription } from "@behaviors/collidable";
import { Kinematic } from "@behaviors/kinematic";
import { ARENA_HEIGHT, ARENA_WIDTH } from "@constants";
import { Howl, Howler } from "howler";

export const AudioController = {
    sounds: {
        bgMusic: new Howl({
            src: [bgMusicSrc],
            loop: true,
            volume: 0.5,
        }),
        flipper: {
            leftDown: new Howl({
                src: leftDownSrc,
                volume: 0.3,
            }),
            leftUp: new Howl({
                src: leftUpSrc,
                volume: 0.3,
            }),
            rightDown: new Howl({
                src: rightDownSrc,
                volume: 0.3,
            }),
            rightUp: new Howl({
                src: rightUpSrc,
                volume: 0.3,
            }),
        },
        ballHit: new Howl({
            src: pinballHitSrc,
            volume: 0.6,
        }),
        splash: new Howl({
            src: splashSrc,
            volume: 0.1,
        }),
        falling: new Howl({
            src: fallingSrc,
        }),
        victory: new Howl({
            src: victorySrc,
            volume: 0.1,
        }),
        gameOver: new Howl({
            src: gameOverSrc,
            volume: 0.1,
        }),
    },
    get volume() {
        return Howler.volume();
    },
    set volume(newVolume: number) {
        Howler.volume(newVolume);
    },

    playSoundForCollision(collision: CollisionDescription) {
        if (collision.type === "CircleAndWall") {
            if (!AudioController.sounds.ballHit.playing()) {
                let volume = 1;
                if (collision.ent.hasBehavior(Kinematic)) {
                    volume = Math.min(collision.ent.velocity.magnitude() / 180, 1.5);
                }
                AudioController.sounds.ballHit.volume(volume);
                AudioController.sounds.ballHit.pos(
                    collision.closestPointOnLine.x / ARENA_WIDTH,
                    collision.closestPointOnLine.y / ARENA_HEIGHT,
                    0
                );
                AudioController.sounds.ballHit.play();
            }
        }
    },

    playBgMusic() {
        AudioController.volume = 0.4;
        AudioController.sounds.bgMusic.play();
    },
};

AudioController.volume = 0.4;

AudioController.sounds.flipper.leftDown.pos(-0.7, 0, 0);
AudioController.sounds.flipper.leftUp.pos(-0.7, 0, 0);
AudioController.sounds.flipper.rightDown.pos(0.7, 0, 0);
AudioController.sounds.flipper.rightUp.pos(0.7, 0, 0);
