const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'The ' + chalk.red('data analysis') + ' is everything!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: path.basename(process.cwd())
    }, {
      type: 'input',
      name: 'env',
      message: 'Conda environment:',
      default: path.basename(process.cwd())
    }, {
      type: 'confirm',
      name: 'createEnv',
      message: 'Do you want to create the Conda environment?',
      default: true
    }, {
      type: 'confirm',
      name: 'initGit',
      message: 'Do you want to initialise a Git repository?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.fs.write(this.destinationPath('data/.gitkeep'), '');
    this.fs.write(this.destinationPath('scripts/.gitkeep'), '');
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    this.fs.copyTpl(this.templatePath('environment.yml'), this.destinationPath('environment.yml'), this.props);
    this.fs.copyTpl(this.templatePath('.env'), this.destinationPath('.env'), this.props);
  },

  install: function () {
    if (this.props.createEnv) {
      this.spawnCommand('conda', ['env', 'create']);
    }
    if (this.props.initGit) {
      this.spawnCommand('git', ['init']);
    }
  }
});
