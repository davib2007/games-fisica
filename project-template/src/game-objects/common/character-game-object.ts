import * as Phaser from 'phaser';
import { Direction, Position } from "../../common/types";
import { InputComponents } from '../../components/input/input-components';
import { ControlsComponent } from '../../components/game.object/controls-component';
import { StateMachine } from '../../components/state-machine/state-machine';
import { IdleState } from '../../components/state-machine/states/character/idle-state';
import { CHARACTER_STATES } from '../../components/state-machine/states/character/character-states';
import { MoveState } from '../../components/state-machine/states/character/move-state';
import { SpeedComponent } from '../../components/game.object/speed-component';
import { DirectionComponent } from '../../components/game.object/direction-component';
import { AnimationComponent, AnimationConfig } from '../../components/game.object/animation-component';

export type CharacterConfig = {
    scene: Phaser.Scene;
    position: Position;
    assetKey: string;
    frame?: number;
    InputComponent: InputComponents;
    animationConfig: AnimationConfig;
    speed: number;
    id?: string;
    isPlayer: boolean;
};

export abstract class CharacterGameObject extends Phaser.Physics.Arcade.Sprite {
    protected _controlsComponent: ControlsComponent;
    protected _speedComponent: SpeedComponent;
    protected _directionComponent: DirectionComponent;
    protected _animationComponent: AnimationComponent;
    protected _stateMachine: StateMachine;
    protected _isPlayer: boolean

    constructor(config: CharacterConfig) {
        const { scene, position, assetKey, frame, id, animationConfig, InputComponent, speed, isPlayer } = config;
        const { x, y } = position;
        super(scene, x , y, assetKey, frame || 0);

        // add object to scene and enable phaser physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // add components
        this._controlsComponent = new ControlsComponent(this, InputComponent);
        this._speedComponent = new SpeedComponent(this, speed);
        this._directionComponent = new DirectionComponent(this);
        this._animationComponent = new AnimationComponent(this, animationConfig)

        // add state machine
        this._stateMachine = new StateMachine(id);

        // general config
        this._isPlayer = isPlayer;
    }

    get isEnemy(): boolean {
      return !this._isPlayer;
    }

    get controls(): InputComponents {
        return this._controlsComponent.controls;
    }

    get speed(): number {
        return this._speedComponent.speed;
    }

    get direction(): Direction {
        return this._directionComponent.direction;
    }

    set direction(value: Direction) {
        this._directionComponent.direction = value;
    }

    get animationComponent(): AnimationComponent {
        return this._animationComponent;
    }

    public update(): void {
     this._stateMachine.update();
}
}