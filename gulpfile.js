var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css'),
	  styleInject = require("gulp-style-inject"),
    replace = require('gulp-replace'),
    compass = require('gulp-compass'),
    htmlhint = require('gulp-htmlhint'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require ('gulp-uglify'),
    less  = require('gulp-less'),
    handlebars = require('gulp-handlebars'),
    declare = require('gulp-declare'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    urlAdjuster = require('gulp-css-replace-url'),
    cleanCSS = require('gulp-clean-css'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    watch = require('gulp-watch'),
    compass = require('gulp-compass');
const del = require('del');
var mail = require('gulp-mail');
 
var smtpInfo = {
  auth: {
    user: 'joao.goncalves@qisat.com.br',
    pass: '*joao.1072'
  },
  host: 'email-ssl.com.br',
  secureConnection: true,
  port: 465
};    



var url_base = 'http://public-local.qisat.com.br'; // LOCAL
var url_html = url_base + '/campanhas/';
var url_imagens = url_base + '/images/';
var url_css = url_base + '/css/';





gulp.task('check-templates', function() {
  gulp.src('qisat-foundation-templates/*.html')
            .pipe(htmlhint())
            .pipe(htmlhint.reporter());
});


// TAREFA FINAL /////////////////////////////////////////////////////////////////////////////////////

/*OBJETIVO FINAL:-Watch monitorar o Sass, para alterar o css,
-Com o css alterado, uma tarefa irá aplicar o css inline no html(inlinecss) - no arquivo selecionado;
-Outra tarefa irá em sequencia aplicar o media query no cabeçalho (inject) - no arquivo selecionado;
-E por fim uma tarefa irá minificar o html final.(htmlmin) - no arquivo selecionado*/
/////////////////////////////////////////////////////////////////////////////////////////////////////

/*gulp.task('inlinefinal', function() {
 return gulp.src('qisat-foundation-templates/*.html')
          //  .pipe(htmlhint())
         //   .pipe(htmlhint.reporter())
            .pipe(styleInject())    
                .pipe(inlineCss({
                  preserveMediaQueries:false,
                  removeStyleTags:false,
                  applyStyleTags:false,
                  //applyLinkTags : false
                }))
                .pipe(htmlmin({
                  collapseWhitespace: true
                }))
                .pipe(gulp.dest('public/templates-inline'))
});*/
/////////////////////////////////////////////////////////////////

/*Pré-tarefa*/
gulp.task('clean', function () {
    return del(['public/css/**', '!css']);
});

/*1° Tarefa, monitora alterações e produz um arquivo .css final na pasta "public/css",
além de produzir um arquivo css minificado com o mesmo conteúdo na mesma pasta*/    

gulp.task('compass', function () {
  console.log('Exec compass');
      return  gulp.src(['sass/foundation-scss/*.scss'])
                  .pipe(compass({
                    config_file: 'config.rb',
                    css: 'public/css/',
                    sass: 'sass/foundation-scss/',
                  }))
                  .pipe(cssmin())
                  .pipe(rename({suffix: '.min'}))
                  .pipe(gulp.dest('public/css/'));
});




gulp.task('icons-replace-url', function() {
  console.log('Exec icons2');
 return gulp.src('public/css/*.css')
            .pipe(replace('../images/', url_imagens ))
            .pipe(gulp.dest('public/css'));
});

gulp.task('icons-url-root', function(){
  console.log('Exec icons1');
  return gulp.src('public/css/*.min.css')
            .pipe(replace(url_base, ''))
            .pipe(gulp.dest('public/css'));
})


/* 2° Tarefa, responsável por alterar os diretórios dos ícones nos css*/
gulp.task('css-series', gulp.series('icons-replace-url','icons-url-root'));


/* 3° Tarefa, responsável por alterar os endereços raízes para endereços reais, para assim
o css poder ser aplicado inline pela tarefa "campanhas-inline" posteiormente*/
gulp.task('replace-inline', function(){
  console.log('Exec replace');
  return gulp.src('campanhas/2019/*.html')
        .pipe(replace('/images/',  url_imagens ))
        .pipe(replace('/campanhas/', url_html ))
        .pipe(replace('/css/', url_css ))
                .pipe(gulp.dest('public/campanhas/2019/inline'))

});


/* 4° Tarefa, seleciona todos os arquivos html do endereço "public/campanhas/2019/inline/" , 
  e insere inline o documento css externo utilizado nos html;
  Além de inserir estilos específicos no cabeçalho do email "<style></style>"
  e também minificar o html final; */
gulp.task('campanhas-inline', function() {
  console.log('Exec inline');
 return gulp.src('public/campanhas/2019/inline/*.html')
          //  .pipe(htmlhint())
         //   .pipe(htmlhint.reporter())
            .pipe(styleInject())    
                .pipe(inlineCss({
                  preserveMediaQueries:false,
                  removeStyleTags:false,
                  applyStyleTags:false
                  //applyLinkTags : false
                }))
                .pipe(htmlmin({
                  collapseWhitespace: true
                }))
                .pipe(gulp.dest('public/campanhas/2019/inline/'))
});


/*5° Tarefa, minifica e transfere o html produzido em email-marketing/campanhas/2019, 
para email-marketing/public/campanhas/2019;*/
gulp.task('campanhas-html-final', function() {
  console.log('Exec htmlfinal');
 return gulp.src('campanhas/2019/*.html')
                .pipe(htmlmin({
                  collapseWhitespace: true
                }))
                .pipe(replace('/css/qisat-foundation.css','/css/qisat-foundation.min.css' ))
                .pipe(gulp.dest('public/campanhas/2019'));
});

gulp.task('watch-all', function () {
  watch(['sass/foundation-scss/*.scss','sass/foundation-scss/components/*.scss','sass/foundation-scss/grid/*.scss','sass/foundation-scss/settings/*.scss','sass/foundation-scss/util/*.scss','public/images/icons/*','campanhas/2019/*.html'],
      gulp.series('compass','css-series','replace-inline','campanhas-inline','campanhas-html-final')) 
});

/* Tarefa default, monitora as pastas e executa as 5 tarefas anteriores em sequencia em qualquer mudança.*/
gulp.task('default',
      gulp.series('clean','compass','css-series','replace-inline','campanhas-inline','campanhas-html-final','watch-all') 
);



/* Tarefa para minificar e transferir os templates produzidos em 'qisat-foundation-templates' para 'public/templates'*/
gulp.task('templates', function() {
 return gulp.src('qisat-foundation-templates/*.html')
                .pipe(replace('public',''))
                .pipe(htmlmin({
                  collapseWhitespace: true
                }))
                .pipe(gulp.dest('public/templates'));
});

/*gulp.task('rep', function(){
  return gulp.src('qisat-foundation-templates/*.html')
        .pipe(replace('small-1 large-1 columns rodape','small-1 large-6 columns rodape'))
                .pipe(gulp.dest('qisat-foundation-templates'))

});*/

///exemplo de watch funcionando
/*gulp.task('watch-compass', function () {
  return watch('sass/foundation-scss/*.scss', function () {
      console.log('exec watch compass');
      return  gulp.src(['sass/foundation-scss/*.scss'])
                  .pipe(compass({
                    config_file: 'config.rb',
                    css: 'estilos/css/',
                    sass: 'sass/foundation-scss/',
                  }))
                  .pipe(cssmin())
                  .pipe(rename({suffix: '.min'}))
                  .pipe(gulp.dest('estilos/css/'));
  });
});*/
 
gulp.task('mail-all', function () {
  return gulp.src(['public/campanhas/2019/inline/*.html'])
    .pipe(mail({
      subject: 'Surprise!?',
      to: [
        'teste@qisat.com.br', 'qisat.email@gmail.com', 'qisat@outlook.com', 'qisat@hotmail.com', 'joao.goncalves@qisat.com.br'
      ],
      from: 'QiSat <qisat@qisat.com.br>',
      smtp: smtpInfo
    }));

  });

gulp.task('mail', function () {
  var template = process.argv[3];
  template = template.replace(/^\-+/, '');
  
  return gulp.src(['public/campanhas/2019/inline/'+template])
    .pipe(mail({
      subject: 'Email!!',
      to: [
        'teste@qisat.com.br', 'qisat.email@gmail.com', 'qisat@outlook.com', 'qisat@hotmail.com', 'joao.goncalves@qisat.com.br' 
      ],
      from: 'QiSat <qisat@qisat.com.br>',
      smtp: smtpInfo
    }));

  });

return gulp.task('mytask', function(cb) {
    console.log(process.argv[3]);
    cb();
});