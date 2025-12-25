from django.core.management.base import BaseCommand

from accounts.models import User, UserRole


class Command(BaseCommand):
    def handle(self, *args, **options):
        admin_email = 'admin@nch.local'
        admin_password = 'Admin123!'

        receptionist_email = 'reception@nch.local'
        receptionist_password = 'Reception123!'

        admin_user, admin_created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'full_name': 'Hotel Admin',
                'role': UserRole.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            },
        )
        if admin_created:
            admin_user.set_password(admin_password)
            admin_user.save(update_fields=['password'])

        receptionist_user, receptionist_created = User.objects.get_or_create(
            email=receptionist_email,
            defaults={
                'full_name': 'Hotel Receptionist',
                'role': UserRole.RECEPTIONIST,
                'is_staff': True,
                'is_active': True,
            },
        )
        if receptionist_created:
            receptionist_user.set_password(receptionist_password)
            receptionist_user.save(update_fields=['password'])

        self.stdout.write('Seeded users:')
        self.stdout.write(f"- admin: {admin_email} / {admin_password} ({'created' if admin_created else 'exists'})")
        self.stdout.write(
            f"- receptionist: {receptionist_email} / {receptionist_password} ({'created' if receptionist_created else 'exists'})"
        )
