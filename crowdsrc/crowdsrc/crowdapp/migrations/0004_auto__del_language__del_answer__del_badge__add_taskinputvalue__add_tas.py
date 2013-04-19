# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'Language'
        db.delete_table(u'crowdapp_language')

        # Deleting model 'Answer'
        db.delete_table(u'crowdapp_answer')

        # Deleting model 'Badge'
        db.delete_table(u'crowdapp_badge')

        # Adding model 'TaskInputValue'
        db.create_table(u'crowdapp_taskinputvalue', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('answer', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.TaskInput'])),
            ('value', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'crowdapp', ['TaskInputValue'])

        # Adding model 'TaskInput'
        db.create_table(u'crowdapp_taskinput', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('task', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.Task'])),
            ('type', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
            ('index', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
        ))
        db.send_create_signal(u'crowdapp', ['TaskInput'])


        # Changing field 'AccessPath.description'
        db.alter_column(u'crowdapp_accesspath', 'description', self.gf('django.db.models.fields.CharField')(max_length=1000))
        # Adding M2M table for field qualifications on 'Task'
        db.create_table(u'crowdapp_task_qualifications', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('task', models.ForeignKey(orm[u'crowdapp.task'], null=False)),
            ('qualification', models.ForeignKey(orm[u'crowdapp.qualification'], null=False))
        ))
        db.create_unique(u'crowdapp_task_qualifications', ['task_id', 'qualification_id'])


        # Changing field 'Task.html'
        db.alter_column(u'crowdapp_task', 'html', self.gf('django.db.models.fields.TextField')())
        # Adding M2M table for field resources on 'Solution'
        db.create_table(u'crowdapp_solution_resources', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('solution', models.ForeignKey(orm[u'crowdapp.solution'], null=False)),
            ('resource', models.ForeignKey(orm[u'crowdapp.resource'], null=False))
        ))
        db.create_unique(u'crowdapp_solution_resources', ['solution_id', 'resource_id'])


        # Changing field 'Qualification.name'
        db.alter_column(u'crowdapp_qualification', 'name', self.gf('django.db.models.fields.CharField')(max_length=200))
        # Removing M2M table for field badges on 'UserProfile'
        db.delete_table('crowdapp_userprofile_badges')

        # Removing M2M table for field languages on 'UserProfile'
        db.delete_table('crowdapp_userprofile_languages')


    def backwards(self, orm):
        # Adding model 'Language'
        db.create_table(u'crowdapp_language', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
        ))
        db.send_create_signal('crowdapp', ['Language'])

        # Adding model 'Answer'
        db.create_table(u'crowdapp_answer', (
            ('index', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
            ('solution', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.Solution'])),
            ('value', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('type', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal('crowdapp', ['Answer'])

        # Adding model 'Badge'
        db.create_table(u'crowdapp_badge', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('crowdapp', ['Badge'])

        # Deleting model 'TaskInputValue'
        db.delete_table(u'crowdapp_taskinputvalue')

        # Deleting model 'TaskInput'
        db.delete_table(u'crowdapp_taskinput')


        # Changing field 'AccessPath.description'
        db.alter_column(u'crowdapp_accesspath', 'description', self.gf('django.db.models.fields.CharField')(max_length=400))
        # Removing M2M table for field qualifications on 'Task'
        db.delete_table('crowdapp_task_qualifications')


        # Changing field 'Task.html'
        db.alter_column(u'crowdapp_task', 'html', self.gf('django.db.models.fields.CharField')(max_length=1000))
        # Removing M2M table for field resources on 'Solution'
        db.delete_table('crowdapp_solution_resources')


        # Changing field 'Qualification.name'
        db.alter_column(u'crowdapp_qualification', 'name', self.gf('django.db.models.fields.CharField')(max_length=100))
        # Adding M2M table for field badges on 'UserProfile'
        db.create_table(u'crowdapp_userprofile_badges', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('userprofile', models.ForeignKey(orm['crowdapp.userprofile'], null=False)),
            ('badge', models.ForeignKey(orm['crowdapp.badge'], null=False))
        ))
        db.create_unique(u'crowdapp_userprofile_badges', ['userprofile_id', 'badge_id'])

        # Adding M2M table for field languages on 'UserProfile'
        db.create_table(u'crowdapp_userprofile_languages', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('userprofile', models.ForeignKey(orm['crowdapp.userprofile'], null=False)),
            ('language', models.ForeignKey(orm['crowdapp.language'], null=False))
        ))
        db.create_unique(u'crowdapp_userprofile_languages', ['userprofile_id', 'language_id'])


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'crowdapp.accesspath': {
            'Meta': {'object_name': 'AccessPath'},
            'cost': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'error': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'task': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.Task']"})
        },
        u'crowdapp.qualification': {
            'Meta': {'object_name': 'Qualification'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'crowdapp.resource': {
            'Meta': {'object_name': 'Resource'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'index': ('django.db.models.fields.SmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'task': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.Task']"})
        },
        u'crowdapp.solution': {
            'Meta': {'object_name': 'Solution'},
            'access_path': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.AccessPath']", 'null': 'True'}),
            'created_at': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'resources': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['crowdapp.Resource']", 'symmetrical': 'False'}),
            'status': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'task': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.Task']"}),
            'worker': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.UserProfile']"})
        },
        u'crowdapp.task': {
            'Meta': {'object_name': 'Task'},
            'cost': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'created_at': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime(2013, 4, 19, 0, 0)'}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.UserProfile']"}),
            'html': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'qualifications': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['crowdapp.Qualification']", 'symmetrical': 'False'})
        },
        u'crowdapp.taskinput': {
            'Meta': {'object_name': 'TaskInput'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'index': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'task': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.Task']"}),
            'type': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'})
        },
        u'crowdapp.taskinputvalue': {
            'Meta': {'object_name': 'TaskInputValue'},
            'answer': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.TaskInput']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'crowdapp.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'birth_date': ('django.db.models.fields.DateField', [], {}),
            'birth_place': ('django.db.models.fields.CharField', [], {'default': "'CH'", 'max_length': '2'}),
            'current_country': ('django.db.models.fields.CharField', [], {'default': "'CH'", 'max_length': '2'}),
            'education_field': ('django.db.models.fields.SmallIntegerField', [], {}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'gender': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_taskcreator': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'qualifications': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['crowdapp.Qualification']", 'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['auth.User']", 'unique': 'True'})
        }
    }

    complete_apps = ['crowdapp']