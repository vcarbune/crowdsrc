# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CustomUser'
        db.create_table(u'crowdapp_customuser', (
            (u'user_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True, primary_key=True)),
        ))
        db.send_create_signal(u'crowdapp', ['CustomUser'])

        # Adding field 'Task.resources_per_task'
        db.add_column(u'crowdapp_task', 'resources_per_task',
                      self.gf('django.db.models.fields.SmallIntegerField')(default=0),
                      keep_default=False)


        # Changing field 'UserProfile.user'
        db.alter_column(u'crowdapp_userprofile', 'user_id', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['crowdapp.CustomUser'], unique=True))

    def backwards(self, orm):
        # Deleting model 'CustomUser'
        db.delete_table(u'crowdapp_customuser')

        # Deleting field 'Task.resources_per_task'
        db.delete_column(u'crowdapp_task', 'resources_per_task')


        # Changing field 'UserProfile.user'
        db.alter_column(u'crowdapp_userprofile', 'user_id', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True))

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
        u'crowdapp.customuser': {
            'Meta': {'object_name': 'CustomUser', '_ormbases': [u'auth.User']},
            u'user_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['auth.User']", 'unique': 'True', 'primary_key': 'True'})
        },
        u'crowdapp.qualification': {
            'Meta': {'object_name': 'Qualification'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'crowdapp.resource': {
            'Meta': {'object_name': 'Resource'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'index': ('django.db.models.fields.SmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
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
            'content': ('django.db.models.fields.TextField', [], {}),
            'cost': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'created_at': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime(2013, 4, 24, 0, 0)'}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.UserProfile']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'qualifications': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['crowdapp.Qualification']", 'symmetrical': 'False', 'blank': 'True'}),
            'resources_per_task': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'})
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
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'solution': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.Solution']"}),
            'taskinput': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['crowdapp.TaskInput']"}),
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
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['crowdapp.CustomUser']", 'unique': 'True'})
        }
    }

    complete_apps = ['crowdapp']