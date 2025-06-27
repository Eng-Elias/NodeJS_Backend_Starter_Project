import { EventEmitter } from 'events';
import { SocketUtils } from './SocketUtils';
import { Logger } from './logger';

class AppEventEmitter extends EventEmitter {}

export class EventUtils {
  private static emitter = new AppEventEmitter();

  /**
   * Emits an event internally for backend listeners only.
   * @param eventName The name of the event.
   * @param data The data to pass with the event.
   */
  public static emitInternal(eventName: string, data: any): void {
    this.emitter.emit(eventName, data);
    Logger.info(`Internal event '${eventName}' emitted.`);
  }

  /**
   * Emits an event to all connected socket clients.
   * @param eventName The name of the event.
   * @param data The data to pass with the event.
   */
  public static emitBroadcast(eventName: string, data: any): void {
    try {
      const io = SocketUtils.getIO();
      io.emit(eventName, data);
      Logger.info(`Broadcasted event '${eventName}' to all clients.`);
    } catch (error) {
      Logger.error(`Failed to broadcast event '${eventName}':`, error);
    }
  }

  /**
   * Emits an event to a specific room.
   * @param room The name of the room.
   * @param eventName The name of the event.
   * @param data The data to pass with the event.
   */
  public static emitToRoom(room: string, eventName: string, data: any): void {
    try {
      const io = SocketUtils.getIO();
      io.to(room).emit(eventName, data);
      Logger.info(`Emitted event '${eventName}' to room '${room}'.`);
    } catch (error) {
      Logger.error(`Failed to emit event to room '${room}':`, error);
    }
  }

  /**
   * Registers a listener for a specific event.
   * @param eventName The name of the event to listen for.
   * @param listener The callback function to execute.
   */
  public static on(
    eventName: string,
    listener: (...args: any[]) => void,
  ): void {
    this.emitter.on(eventName, listener);
  }

  /**
   * Registers a one-time listener for a specific event.
   * @param eventName The name of the event to listen for.
   * @param listener The callback function to execute.
   */
  public static once(
    eventName: string,
    listener: (...args: any[]) => void,
  ): void {
    this.emitter.once(eventName, listener);
  }

  /**
   * Removes a listener for a specific event.
   * @param eventName The name of the event.
   * @param listener The listener function to remove.
   */
  public static off(
    eventName: string,
    listener: (...args: any[]) => void,
  ): void {
    this.emitter.removeListener(eventName, listener);
  }
}
