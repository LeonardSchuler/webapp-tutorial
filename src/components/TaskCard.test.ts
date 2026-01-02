import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import './TaskCard';

describe('TaskCard Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering', () => {
    it('should render task title and description', () => {
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Test Task');
      taskCard.setAttribute('description', 'Test Description');
      container.appendChild(taskCard);

      const shadow = taskCard.shadowRoot;
      expect(shadow?.querySelector('.task-title')?.textContent).toBe('Test Task');
      expect(shadow?.querySelector('.task-description')?.textContent).toBe('Test Description');
    });

    it('should show completed state', () => {
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Completed Task');
      taskCard.setAttribute('completed', '');
      container.appendChild(taskCard);

      // Check that the completed attribute is set
      expect(taskCard.hasAttribute('completed')).toBe(true);

      // Check that the component renders with completed styling in the shadow DOM
      const styleElement = taskCard.shadowRoot?.querySelector('style');
      expect(styleElement?.textContent).toContain('text-decoration: line-through');

      // Verify the complete button shows 'Undo' text
      const completeBtn = taskCard.shadowRoot?.querySelector('.btn-complete');
      expect(completeBtn?.textContent).toBe('Undo');
    });
  });

  describe('User Interactions', () => {
    it('should emit toggle-complete event when user clicks complete button', async () => {
      const user = userEvent.setup();
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Test Task');
      container.appendChild(taskCard);

      let eventFired = false;
      taskCard.addEventListener('toggle-complete', () => {
        eventFired = true;
      });

      const completeBtn = taskCard.shadowRoot?.querySelector('.btn-complete') as HTMLButtonElement;
      await user.click(completeBtn);

      expect(eventFired).toBe(true);
    });

    it('should emit delete-task event when user clicks delete button', async () => {
      const user = userEvent.setup();
      const taskCard = document.createElement('task-card');
      taskCard.setAttribute('title', 'Test Task');
      container.appendChild(taskCard);

      let eventFired = false;
      taskCard.addEventListener('delete-task', () => {
        eventFired = true;
      });

      const deleteBtn = taskCard.shadowRoot?.querySelector('.btn-delete') as HTMLButtonElement;
      await user.click(deleteBtn);

      expect(eventFired).toBe(true);
    });
  });
});
