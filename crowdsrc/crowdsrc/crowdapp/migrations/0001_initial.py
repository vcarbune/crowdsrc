# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Language'
        db.create_table('crowdapp_language', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
        ))
        db.send_create_signal('crowdapp', ['Language'])

        # Adding model 'Qualification'
        db.create_table('crowdapp_qualification', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('crowdapp', ['Qualification'])

        # Adding model 'Badge'
        db.create_table('crowdapp_badge', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('crowdapp', ['Badge'])

        # Adding model 'UserProfile'
        db.create_table('crowdapp_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True)),
            ('last_login', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('gender', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('birth_date', self.gf('django.db.models.fields.DateField')()),
            ('education_field', self.gf('django.db.models.fields.SmallIntegerField')()),
            ('birth_place', self.gf('django.db.models.fields.CharField')(default='CH', max_length=2)),
            ('current_country', self.gf('django.db.models.fields.CharField')(default='CH', max_length=2)),
            ('is_taskcreator', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('crowdapp', ['UserProfile'])

        # Adding M2M table for field languages on 'UserProfile'
        db.create_table('crowdapp_userprofile_languages', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('userprofile', models.ForeignKey(orm['crowdapp.userprofile'], null=False)),
            ('language', models.ForeignKey(orm['crowdapp.language'], null=False))
        ))
        db.create_unique('crowdapp_userprofile_languages', ['userprofile_id', 'language_id'])

        # Adding M2M table for field qualifications on 'UserProfile'
        db.create_table('crowdapp_userprofile_qualifications', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('userprofile', models.ForeignKey(orm['crowdapp.userprofile'], null=False)),
            ('qualification', models.ForeignKey(orm['crowdapp.qualification'], null=False))
        ))
        db.create_unique('crowdapp_userprofile_qualifications', ['userprofile_id', 'qualification_id'])

        # Adding M2M table for field badges on 'UserProfile'
        db.create_table('crowdapp_userprofile_badges', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('userprofile', models.ForeignKey(orm['crowdapp.userprofile'], null=False)),
            ('badge', models.ForeignKey(orm['crowdapp.badge'], null=False))
        ))
        db.create_unique('crowdapp_userprofile_badges', ['userprofile_id', 'badge_id'])

        # Adding model 'Task'
        db.create_table('crowdapp_task', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('creator', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.UserProfile'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('html', self.gf('django.db.models.fields.CharField')(max_length=1000)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('cost', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
        ))
        db.send_create_signal('crowdapp', ['Task'])

        # Adding model 'Resource'
        db.create_table('crowdapp_resource', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('task', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.Task'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('index', self.gf('django.db.models.fields.SmallIntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal('crowdapp', ['Resource'])

        # Adding model 'AccessPath'
        db.create_table('crowdapp_accesspath', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('task', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.Task'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=400)),
            ('cost', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
            ('error', self.gf('django.db.models.fields.FloatField')(default=0)),
        ))
        db.send_create_signal('crowdapp', ['AccessPath'])

        # Adding model 'Solution'
        db.create_table('crowdapp_solution', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('worker', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.UserProfile'])),
            ('access_path', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.AccessPath'])),
            ('status', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
        ))
        db.send_create_signal('crowdapp', ['Solution'])

        # Adding model 'Answer'
        db.create_table('crowdapp_answer', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('solution', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['crowdapp.Solution'])),
            ('type', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
            ('value', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('index', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
        ))
        db.send_create_signal('crowdapp', ['Answer'])


    def backwards(self, orm):
        # Deleting model 'Language'
        db.delete_table('crowdapp_language')

        # Deleting model 'Qualification'
        db.delete_table('crowdapp_qualification')

        # Deleting model 'Badge'
        db.delete_table('crowdapp_badge')

        # Deleting model 'UserProfile'
        db.delete_table('crowdapp_userprofile')

        # Removing M2M table for field languages on 'UserProfile'
        db.delete_table('crowdapp_userprofile_languages')

        # Removing M2M table for field qualifications on 'UserProfile'
        db.delete_table('crowdapp_userprofile_qualifications')

        # Removing M2M table for field badges on 'UserProfile'
        db.delete_table('crowdapp_userprofile_badges')

        # Deleting model 'Task'
        db.delete_table('crowdapp_task')

        # Deleting model 'Resource'
        db.delete_table('crowdapp_resource')

        # Deleting model 'AccessPath'
        db.delete_table('crowdapp_accesspath')

        # Deleting model 'Solution'
        db.delete_table('crowdapp_solution')

        # Deleting model 'Answer'
        db.delete_table('crowdapp_answer')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'crowdapp.accesspath': {
            'Meta': {'object_name': 'AccessPath'},
            'cost': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '400'}),
            'error': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'task': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['crowdapp.Task']"})
        },
        'crowdapp.answer': {
            'Meta': {'object_name': 'Answer'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'index': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'solution': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['crowdapp.Solution']"}),
            'type': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        'crowdapp.badge': {
            'Meta': {'object_name': 'Badge'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'crowdapp.language': {
            'Meta': {'object_name': 'Language'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        'crowdapp.qualification': {
            'Meta': {'object_name': 'Qualification'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'crowdapp.resource': {
            'Meta': {'object_name': 'Resource'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'index': ('django.db.models.fields.SmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'task': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['crowdapp.Task']"})
        },
        'crowdapp.solution': {
            'Meta': {'object_name': 'Solution'},
            'access_path': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['crowdapp.AccessPath']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'status': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'worker': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['crowdapp.UserProfile']"})
        },
        'crowdapp.task': {
            'Meta': {'object_name': 'Task'},
            'cost': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['crowdapp.UserProfile']"}),
            'html': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        'crowdapp.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'badges': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['crowdapp.Badge']", 'symmetrical': 'False'}),
            'birth_date': ('django.db.models.fields.DateField', [], {}),
            'birth_place': ('django.db.models.fields.CharField', [], {'default': "'CH'", 'max_length': '2'}),
            'current_country': ('django.db.models.fields.CharField', [], {'default': "'CH'", 'max_length': '2'}),
            'education_field': ('django.db.models.fields.SmallIntegerField', [], {}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'gender': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_taskcreator': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'languages': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['crowdapp.Language']", 'symmetrical': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'qualifications': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['crowdapp.Qualification']", 'symmetrical': 'False'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'})
        }
    }

    complete_apps = ['crowdapp']