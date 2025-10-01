import { Command } from 'commander';
import { ChecklistManager } from '../utils/checklist-manager';
import { resolve } from 'path';

const program = new Command();

program
  .name('a11y-checklist')
  .description('CLI tool for A11Y checklist management')
  .version('1.0.0');

program
  .command('check')
  .description('Check for outdated or failing checklists')
  .option('-d, --dir <directory>', 'Checklist directory', 'a11y-checklists')
  .option('--fail-on-outdated', 'Exit with error code if outdated checklists found', false)
  .option('--fail-on-failing', 'Exit with error code if failing checklists found', true)
  .action(async (options) => {
    const projectRoot = process.cwd();
    const manager = new ChecklistManager(projectRoot, options.dir);

    try {
      const [outdatedChecklists, failingChecklists] = await Promise.all([
        manager.getOutdatedChecklists(),
        manager.getFailingChecklists(),
      ]);

      console.log('🔍 A11Y Checklist Report');
      console.log('========================');

      if (outdatedChecklists.length > 0) {
        console.log('\n⚠️  Outdated Checklists:');
        outdatedChecklists.forEach(checklist => {
          console.log(`  - ${checklist.storyId} (${checklist.componentPath})`);
        });
      }

      if (failingChecklists.length > 0) {
        console.log('\n❌ Failing Checklists:');
        failingChecklists.forEach(checklist => {
          const failingItems = checklist.results.filter(item => item.status === 'fail');
          console.log(`  - ${checklist.storyId} (${failingItems.length} failures)`);
          failingItems.forEach(item => {
            console.log(`    • ${item.guidelineId}: ${item.reason || 'No reason provided'}`);
          });
        });
      }

      if (outdatedChecklists.length === 0 && failingChecklists.length === 0) {
        console.log('\n✅ All checklists are up to date and passing!');
      }

      let exitCode = 0;
      if (options.failOnOutdated && outdatedChecklists.length > 0) {
        exitCode = 1;
      }
      if (options.failOnFailing && failingChecklists.length > 0) {
        exitCode = 1;
      }

      process.exit(exitCode);
    } catch (error) {
      console.error('Error checking checklists:', error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all checklists')
  .option('-d, --dir <directory>', 'Checklist directory', 'a11y-checklists')
  .action(async (options) => {
    const projectRoot = process.cwd();
    const manager = new ChecklistManager(projectRoot, options.dir);

    try {
      const checklists = await manager.getAllChecklists();
      
      console.log('📋 All A11Y Checklists');
      console.log('======================');
      
      if (checklists.length === 0) {
        console.log('No checklists found.');
        return;
      }

      checklists.forEach(checklist => {
        const summary = checklist.results.reduce(
          (acc, item) => {
            acc[item.status]++;
            acc.total++;
            return acc;
          },
          { pass: 0, fail: 0, not_applicable: 0, unknown: 0, total: 0 },
        );

        console.log(`\n📄 ${checklist.storyId}`);
        console.log(`   Component: ${checklist.componentPath}`);
        console.log(`   Updated: ${checklist.lastUpdated}`);
        console.log(
          `   Results: ${summary.pass} pass, ${summary.fail} fail, ${summary.not_applicable} n/a, ${summary.unknown} unknown`,
        );
      });
    } catch (error) {
      console.error('Error listing checklists:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);