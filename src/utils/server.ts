import type { Router, Request, Response } from 'express';
import { ChecklistManager } from './checklist-manager';
import type { ChecklistFile, LoadChecklistResponse, SaveChecklistPayload } from '../types';

export interface A11yServerOptions {
  projectRoot: string;
  checklistDir?: string;
}

export class A11yChecklistServer {
  private checklistManager: ChecklistManager;

  constructor(options: A11yServerOptions) {
    this.checklistManager = new ChecklistManager(options.projectRoot, options.checklistDir);
  }

  setupRoutes(router: Router): void {
    // Get checklist for a story
    router.get('/a11y-checklist/:storyId', async (req: Request, res: Response) => {
      try {
        const { storyId } = req.params;
        const { componentPath, componentName, wcagVersion = '2.2' } = req.query;

        if (!storyId) {
          return res.status(400).json({ 
            error: 'storyId parameter is required' 
          });
        }

        if (!componentPath || typeof componentPath !== 'string') {
          return res.status(400).json({ 
            error: 'componentPath query parameter is required' 
          });
        }

        // Try to load existing checklist
        let checklist = await this.checklistManager.loadChecklist(storyId);
        let isOutdated = false;
        
        if (!checklist) {
          // Create a default checklist if none exists
          checklist = await this.checklistManager.createDefaultChecklist(
            storyId,
            componentPath,
            componentName as string | undefined,
            wcagVersion as string
          );
        } else {
          // Check if existing checklist is outdated
          isOutdated = await this.checklistManager.isChecklistOutdated(checklist);
        }

        // Get current component hash
        const hashResponse = await this.checklistManager.computeComponentHash(componentPath);
        
        const response: LoadChecklistResponse = {
          checklist,
          isOutdated,
          currentHash: hashResponse.hash,
        };

        res.json(response);
      } catch (error) {
        console.error('Error loading checklist:', error);
        res.status(500).json({ 
          error: 'Failed to load checklist',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Save checklist for a story
    router.put('/a11y-checklist/:storyId', async (req: Request, res: Response) => {
      try {
        const { storyId } = req.params;
        const payload: SaveChecklistPayload = req.body;

        if (!payload.checklist) {
          return res.status(400).json({ 
            error: 'checklist is required in request body' 
          });
        }

        if (payload.storyId !== storyId) {
          return res.status(400).json({ 
            error: 'storyId in URL must match storyId in checklist' 
          });
        }

        // Update the component hash before saving
        const hashResponse = await this.checklistManager.computeComponentHash(
          payload.checklist.componentPath
        );
        
        if (hashResponse.exists) {
          payload.checklist.componentHash = hashResponse.hash;
        }

        await this.checklistManager.saveChecklist(payload.checklist);

        res.json({ 
          success: true, 
          message: 'Checklist saved successfully',
          hash: hashResponse.hash
        });
      } catch (error) {
        console.error('Error saving checklist:', error);
        res.status(500).json({ 
          error: 'Failed to save checklist',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get component hash
    router.get('/a11y-component-hash', async (req: Request, res: Response) => {
      try {
        const { componentPath } = req.query;

        if (!componentPath || typeof componentPath !== 'string') {
          return res.status(400).json({ 
            error: 'componentPath query parameter is required' 
          });
        }

        const hashResponse = await this.checklistManager.computeComponentHash(componentPath);
        res.json(hashResponse);
      } catch (error) {
        console.error('Error computing component hash:', error);
        res.status(500).json({ 
          error: 'Failed to compute component hash',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get all checklists (for debugging/CI)
    router.get('/a11y-checklists', async (req: Request, res: Response) => {
      try {
        const checklists = await this.checklistManager.getAllChecklists();
        res.json(checklists);
      } catch (error) {
        console.error('Error getting all checklists:', error);
        res.status(500).json({ 
          error: 'Failed to get checklists',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get outdated checklists (for CI)
    router.get('/a11y-checklists/outdated', async (req: Request, res: Response) => {
      try {
        const outdatedChecklists = await this.checklistManager.getOutdatedChecklists();
        res.json(outdatedChecklists);
      } catch (error) {
        console.error('Error getting outdated checklists:', error);
        res.status(500).json({ 
          error: 'Failed to get outdated checklists',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get failing checklists (for CI)
    router.get('/a11y-checklists/failing', async (req: Request, res: Response) => {
      try {
        const failingChecklists = await this.checklistManager.getFailingChecklists();
        res.json(failingChecklists);
      } catch (error) {
        console.error('Error getting failing checklists:', error);
        res.status(500).json({ 
          error: 'Failed to get failing checklists',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }
}