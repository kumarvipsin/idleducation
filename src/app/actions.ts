/**
 * @fileoverview This file re-exports all server actions from the modular action files.
 * This barrel file allows for a single import point for all server actions in the application,
 * while keeping the action logic organized into separate, domain-specific files.
 */

export * from './actions/auth';
export * from './actions/forms';
export * from './actions/admin';
export * from './actions/data';
export * from './actions/user';
