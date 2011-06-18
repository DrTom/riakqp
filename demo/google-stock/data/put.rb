#!/usr/bin/env ruby
%w[rubygems csv time riak].each{|lib| require lib}

client  = Riak::Client.new(:http_port => 8091, :host => '127.0.0.1')
bucket  = client['goog']

quotes  = CSV.read 'goog.csv'
header  = quotes.shift

quotes.each do |row|
  obj = bucket.new row.first
  puts obj.key
  obj.data = Hash[ [header, row].transpose ]
  obj.store
end
