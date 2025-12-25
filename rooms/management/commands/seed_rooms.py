from django.core.management.base import BaseCommand

from rooms.models import Room


class Command(BaseCommand):
    help = 'Seed initial room data for development.'

    def handle(self, *args, **options):
        rooms = [
            {
                'name': 'Single Suite',
                'description': 'Cozy and comfortable room with a single bed, perfect for solo travelers.',
                'price': '129.00',
                'size': 25,
                'max_occupancy': 1,
                'amenities': ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Coffee Maker'],
            },
            {
                'name': 'Standard Suite',
                'description': 'Spacious room with a queen-size bed, ideal for couples or business travelers.',
                'price': '189.00',
                'size': 35,
                'max_occupancy': 2,
                'amenities': ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Coffee Maker', 'Mini Bar'],
            },
            {
                'name': 'Executive Suite',
                'description': 'Luxurious suite with a king-size bed and separate living area.',
                'price': '259.00',
                'size': 50,
                'max_occupancy': 2,
                'amenities': ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Coffee Maker', 'Mini Bar', 'Ocean View'],
            },
        ]

        created = 0
        for r in rooms:
            obj, was_created = Room.objects.get_or_create(
                name=r['name'],
                defaults={
                    'description': r['description'],
                    'price': r['price'],
                    'size': r['size'],
                    'max_occupancy': r['max_occupancy'],
                    'amenities': r['amenities'],
                    'is_active': True,
                },
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded rooms. Created {created} new rooms.'))
